import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createGalaxy } from '../lib/galaxy'
import { createGalaxyPointer, type GalaxyRotation } from '../lib/galaxyMotion'
import { useMotion } from '../lib/motion'

const ParticleCanvas = lazy(() => import('./ParticleCanvas'))

class ArtBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFailure()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function StaticArt() {
  const [field] = useState(() => createGalaxy(true))
  return (
    <div className="static-art" role="img" aria-label="청백색과 금빛 별들이 모인 나선 은하">
      <svg viewBox="0 0 700 700" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="galaxy-halo">
            <stop stopColor="#d9edff" stopOpacity=".55" />
            <stop offset=".12" stopColor="#82b4d4" stopOpacity=".16" />
            <stop offset="1" stopColor="#385c7a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="galaxy-core">
            <stop stopColor="#fff" />
            <stop offset=".2" stopColor="#d7edff" stopOpacity=".8" />
            <stop offset="1" stopColor="#9ac8ef" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="350" cy="350" r="280" fill="url(#galaxy-halo)" />
        <g transform="rotate(-18 350 350)">
          {Array.from({ length: 800 }, (_, index) => {
            const i = index * 6
            return (
              <circle
                key={i}
                cx={350 + field.positions[i * 3] * 92}
                cy={350 + field.positions[i * 3 + 1] * 76}
                r={Math.min(2.4, field.sizes[i] * 0.5)}
                fill={field.seeds[i] > 0.78 ? '#edba8c' : '#bfddf6'}
                opacity={0.3 + field.seeds[i] * 0.7}
              />
            )
          })}
        </g>
        <circle cx="350" cy="350" r="34" fill="url(#galaxy-core)" />
      </svg>
    </div>
  )
}

export default function HeroArt({
  opening,
  onStage,
  onComplete,
}: {
  opening: boolean
  onStage: (stage: number) => void
  onComplete: () => void
}) {
  const { enabled } = useMotion()
  const container = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; target: HTMLButtonElement } | null>(null)
  const rotation = useRef<GalaxyRotation>({ x: 0, y: 0, returning: true })
  const pointer = useRef(createGalaxyPointer())
  const [dragging, setDragging] = useState(false)
  const [supported, setSupported] = useState<boolean | null>(null)
  const [visible, setVisible] = useState(true)
  const [failed, setFailed] = useState(false)
  const progress = useRef(0)
  const interactive = enabled && supported && !failed

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !event.isPrimary) return
    if (event.pointerType === 'touch' && !drag.current) return
    if (event.buttons && !drag.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    const y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2
    const active = Math.abs(x) <= 1 && Math.abs(y) <= 1
    const pressed = !!drag.current
    const current = pointer.current
    if (current.active !== active || current.pressed !== pressed) current.epoch++
    Object.assign(current, { x, y, active, pressed })
  }

  const finishDrag = (keepHover = false) => {
    const previous = drag.current
    drag.current = null
    if (previous?.target.hasPointerCapture(previous.id)) {
      previous.target.releasePointerCapture(previous.id)
    }
    setDragging(false)
    pointer.current.pressed = false
    pointer.current.active = keepHover && pointer.current.active
    pointer.current.epoch++
  }

  const resetInteraction = useEffectEvent(() => {
    finishDrag()
    pointer.current.reset++
  })

  useEffect(() => {
    try {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection
      const probe = document.createElement('canvas')
      const gl = connection?.saveData ? null : probe.getContext('webgl2')
      setSupported(Boolean(gl))
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      setSupported(false)
    }
    const target = container.current
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '100px',
    })
    if (target) observer.observe(target)
    const resizeObserver = new ResizeObserver(() => resetInteraction())
    if (target) resizeObserver.observe(target)
    const reset = () => resetInteraction()
    const hide = () => {
      if (document.hidden) resetInteraction()
    }
    const update = () => {
      pointer.current.lastScrollAt = performance.now()
      if (!target) return
      progress.current = Math.min(
        1,
        Math.max(0, -target.getBoundingClientRect().top / Math.max(window.innerHeight, 1)),
      )
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('blur', reset)
    window.addEventListener('resize', reset, { passive: true })
    document.addEventListener('visibilitychange', hide)
    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', reset)
      document.removeEventListener('visibilitychange', hide)
      const previous = drag.current
      drag.current = null
      if (previous?.target.hasPointerCapture(previous.id))
        previous.target.releasePointerCapture(previous.id)
    }
  }, [])

  useEffect(() => {
    if (opening && (supported === false || failed || !enabled)) onComplete()
  }, [opening, supported, failed, enabled, onComplete])

  useEffect(() => {
    if (!enabled || failed) resetInteraction()
  }, [enabled, failed])

  const fallback = <StaticArt />
  return (
    <div
      className="hero-art"
      ref={container}
      onPointerMove={trackPointer}
      onPointerDown={trackPointer}
      onPointerLeave={() => {
        if (!drag.current) {
          pointer.current.active = false
          pointer.current.epoch++
        }
      }}
    >
      <div className="art-glow" aria-hidden="true" />
      <div className="galaxy-renderer">
        {interactive ? (
          <ArtBoundary fallback={fallback} onFailure={() => setFailed(true)}>
            <Suspense fallback={fallback}>
              <ParticleCanvas
                visible={visible}
                progress={progress}
                rotation={rotation}
                pointer={pointer}
                onFailure={() => setFailed(true)}
                opening={opening}
                onStage={onStage}
                onComplete={onComplete}
              />
            </Suspense>
          </ArtBoundary>
        ) : (
          fallback
        )}
      </div>
      {interactive && (
        <button
          className="galaxy-interaction"
          aria-label="은하 회전: 마우스 이동 방향으로 별들이 흐릅니다. 드래그하거나 방향키로 회전하면 해당 각도가 유지됩니다. Enter를 누르면 기준 각도로 돌아옵니다."
          data-dragging={dragging}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0 || drag.current) return
            try {
              event.currentTarget.setPointerCapture(event.pointerId)
            } catch {
              return
            }
            drag.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              target: event.currentTarget,
            }
            rotation.current.returning = false
            pointer.current.pressed = true
            pointer.current.epoch++
            setDragging(true)
          }}
          onPointerMove={(event) => {
            const previous = drag.current
            if (!previous || previous.id !== event.pointerId) return
            if (!event.buttons) {
              finishDrag(true)
              return
            }
            rotation.current.y = Math.max(
              -1.6,
              Math.min(1.6, rotation.current.y + (event.clientX - previous.x) * 0.005),
            )
            rotation.current.x = Math.max(
              -0.85,
              Math.min(0.85, rotation.current.x + (event.clientY - previous.y) * 0.005),
            )
            previous.x = event.clientX
            previous.y = event.clientY
          }}
          onPointerUp={(event) => {
            if (drag.current?.id === event.pointerId) finishDrag(event.pointerType === 'mouse')
          }}
          onPointerCancel={() => {
            finishDrag()
          }}
          onLostPointerCapture={(event) => {
            if (drag.current?.id === event.pointerId) finishDrag()
          }}
          onBlur={() => finishDrag()}
          onKeyDown={(event) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
              event.preventDefault()
              rotation.current.returning = false
              if (event.key === 'ArrowLeft') rotation.current.y -= 0.08
              if (event.key === 'ArrowRight') rotation.current.y += 0.08
              if (event.key === 'ArrowUp') rotation.current.x -= 0.08
              if (event.key === 'ArrowDown') rotation.current.x += 0.08
              rotation.current.x = Math.max(-0.85, Math.min(0.85, rotation.current.x))
              rotation.current.y = Math.max(-1.6, Math.min(1.6, rotation.current.y))
            }
          }}
          onClick={(event) => {
            if (event.detail === 0) {
              rotation.current = { x: 0, y: 0, returning: true }
              finishDrag()
            }
          }}
        />
      )}
    </div>
  )
}
