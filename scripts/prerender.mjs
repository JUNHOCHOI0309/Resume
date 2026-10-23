import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: Portfolio } = await vite.ssrLoadModule('/src/Portfolio.tsx')
  const { projects, siteUrl } = await vite.ssrLoadModule('/src/data/content.ts')
  const { getMetadata } = await vite.ssrLoadModule('/src/lib/metadata.ts')
  const output = path.resolve('dist')
  const template = await readFile(path.join(output, 'index.html'), 'utf8')
  const routes = ['/', '/work', ...projects.map((project) => `/work/${project.slug}`)]
  const escape = (text) =>
    text
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')

  for (const route of [...routes, '/404']) {
    const meta = getMetadata(route)
    const markup = renderToString(
      createElement(StaticRouter, { location: route }, createElement(Portfolio)),
    )
    let html = template.replace(
      '<div id="app"></div>',
      `<div id="app" data-route="${route}">${markup}</div>`,
    )
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/<link rel="canonical"[^>]+>/, `<link rel="canonical" href="${meta.url}" />`)
      .replace(
        /<meta\s+name="description"[^>]+>/,
        `<meta name="description" content="${escape(meta.description)}" />`,
      )
      .replace(
        /<meta property="og:title"[^>]+>/,
        `<meta property="og:title" content="${escape(meta.title)}" />`,
      )
      .replace(
        /<meta\s+property="og:description"[^>]+>/,
        `<meta property="og:description" content="${escape(meta.description)}" />`,
      )
      .replace(/<meta property="og:url"[^>]+>/, `<meta property="og:url" content="${meta.url}" />`)
    if (meta.notFound) html = html.replace('content="index, follow"', 'content="noindex, follow"')
    const directory = route === '/' || route === '/404' ? output : path.join(output, route.slice(1))
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, route === '/404' ? '404.html' : 'index.html'), html)
    // Extensionless requests also resolve in Vite preview and static file servers.
    if (route !== '/' && route !== '/404')
      await writeFile(path.join(output, `${route.slice(1)}.html`), html)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route === '/' ? '/' : `${route}/`}</loc></url>`).join('\n')}\n</urlset>\n`
  await writeFile(path.join(output, 'sitemap.xml'), sitemap)
  console.log(`Prerendered ${routes.length} pages and 404.html; sitemap updated.`)
} finally {
  await vite.close()
}
