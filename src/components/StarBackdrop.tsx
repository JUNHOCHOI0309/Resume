import { useEffect, useRef, useState } from 'react'
import { createGalaxyMotion, createGalaxyPointer, stepGalaxyMotion } from '../lib/galaxyMotion'
import { createStarfield, trackStarPointer } from '../lib/starfield'
import { useMotion } from '../lib/motion'

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function createGlow(color: string) {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 64
  const context = sprite.getContext('2d')
  if (!context) return sprite
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  glow.addColorStop(0, '#f3f8ff')
  glow.addColorStop(0.055, '#f3f8fff0')
  glow.addColorStop(0.16, `rgba(${color}, .6)`)
  glow.addColorStop(0.42, `rgba(${color}, .12)`)
  glow.addColorStop(1, `rgba(${color}, 0)`)
  context.fillStyle = glow
  context.fillRect(0, 0, 64, 64)
  return sprite
}

export default function StarBackdrop() {
  const { enabled } = useMotion()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!enabled || connection?.saveData) return
    const element = canvas.current
    const context = element?.getContext('2d', { alpha: true })
    if (!element || !context) return

    let compact = window.innerWidth < 768 || navigator.hardwareConcurrency <= 4
    let field = createStarfield(compact)
    let motion = createGalaxyMotion(field.seeds.length)
    const pointer = createGalaxyPointer()
    const glows = [
      createGlow('124, 190, 236'),
      createGlow('208, 228, 248'),
      createGlow('235, 178, 122'),
    ]
    let width = 1,
      height = 1,
      frame = 0,
      previousTime = performance.now(),
      time = 0
    let disposed = false

    const resetPointer = () => {
      pointer.active = false
      pointer.pressed = false
      pointer.epoch++
      pointer.reset++
    }
    const resize = () => {
      const bounds = element.parentElement?.getBoundingClientRect()
      width = Math.max(1, bounds?.width || window.innerWidth)
      height = Math.max(1, bounds?.height || window.innerHeight)
      const nextCompact = width < 768 || navigator.hardwareConcurrency <= 4
      if (nextCompact !== compact) {
        compact = nextCompact
        field = createStarfield(compact)
        motion = createGalaxyMotion(field.seeds.length)
      }
      const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.25)
      element.width = Math.round(width * dpr)
      element.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      resetPointer()
    }
    const draw = (now: number) => {
      frame = 0
      if (disposed || document.hidden) return
      const delta = Math.max(0, Math.min(0.05, (now - previousTime) / 1000))
      previousTime = now
      time += delta
      stepGalaxyMotion(motion, field, {
        delta,
        time: 0,
        assembly: 1,
        progress: 0,
        width,
        height,
        matrix: identity,
        pointer,
        scrolling: now - pointer.lastScrollAt < 120,
      })
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'
      for (let i = 0; i < field.seeds.length; i++) {
        const seed = field.seeds[i]
        const x = ((field.positions[i * 3] + motion.offsets[i * 2] + 1) * width) / 2
        const y = ((1 - field.positions[i * 3 + 1] - motion.offsets[i * 2 + 1]) * height) / 2
        const size = 7 + field.sizes[i] * 18
        const shimmer = 0.86 + Math.sin(time * 0.5 + seed * 40) * 0.14
        context.globalAlpha = (0.22 + seed * 0.46) * shimmer
        context.drawImage(
          glows[seed > 0.86 ? 2 : seed > 0.55 ? 1 : 0],
          x - size / 2,
          y - size / 2,
          size,
          size,
        )
      }
      context.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }
    const move = (event: PointerEvent) => {
      if (!event.isPrimary) return
      if ((event.pointerType !== 'mouse' && event.pointerType !== 'pen') || event.buttons) {
        pointer.active = false
        pointer.epoch++
        return
      }
      pointer.pressed = false
      trackStarPointer(pointer, event.clientX, event.clientY, width, height)
    }
    const down = () => {
      pointer.pressed = true
      pointer.epoch++
    }
    const up = () => {
      pointer.pressed = false
      pointer.active = false
      pointer.epoch++
    }
    const scroll = () => {
      pointer.lastScrollAt = performance.now()
    }
    const leave = () => {
      pointer.active = false
      pointer.epoch++
    }
    const visibility = () => {
      resetPointer()
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame) {
        previousTime = performance.now()
        frame = requestAnimationFrame(draw)
      }
    }
    const passive = { capture: true, passive: true }
    const observer = new ResizeObserver(resize)
    if (element.parentElement) observer.observe(element.parentElement)
    resize()
    draw(performance.now())
    setReady(true)
    window.addEventListener('pointermove', move, passive)
    window.addEventListener('pointerdown', down, passive)
    window.addEventListener('pointerup', up, passive)
    window.addEventListener('pointercancel', up, passive)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('blur', resetPointer)
    document.documentElement.addEventListener('pointerleave', leave, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      context.clearRect(0, 0, width, height)
      window.removeEventListener('pointermove', move, true)
      window.removeEventListener('pointerdown', down, true)
      window.removeEventListener('pointerup', up, true)
      window.removeEventListener('pointercancel', up, true)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('blur', resetPointer)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [enabled])

  return (
    <div
      className="star-backdrop"
      aria-hidden="true"
      data-mode={enabled && ready ? 'interactive' : 'static'}
    >
      <div className="star-backdrop-static" />
      <canvas ref={canvas} />
    </div>
  )
}
