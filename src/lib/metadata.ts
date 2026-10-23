import { profile, projects, siteUrl } from '../data/content'

export function getMetadata(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/'
  const project = projects.find((item) => path === `/work/${item.slug}`)
  const title = project
    ? `${project.name} | ${profile.name} Portfolio`
    : path === '/work'
      ? `프로젝트 목록 | ${profile.name} 포트폴리오`
      : `${profile.name} | 웹 개발자 포트폴리오`
  const description =
    project?.description ??
    `${profile.name}의 웹 개발 포트폴리오. 투표 서비스, 뉴스 사이트, 대회 신청·결제 웹사이트 등 프로젝트의 기능과 담당 범위를 소개합니다.`
  const notFound = path !== '/' && path !== '/work' && !project
  return {
    title: notFound ? `페이지를 찾을 수 없습니다 | ${profile.name}` : title,
    description,
    url: `${siteUrl}${path === '/' ? '/' : `${path}/`}`,
    notFound,
  }
}
