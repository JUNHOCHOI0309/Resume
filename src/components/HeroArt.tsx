import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
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
  return (
    <div className="static-art">
      <svg viewBox="0 0 700 700" fill="none">
        <defs>
          <radialGradient id="particle-halo">
            <stop stopColor="#9e77ff" stopOpacity=".2" />
            <stop offset="1" stopColor="#9e77ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="350" cy="350" r="330" fill="url(#particle-halo)" />
        {Array.from({ length: 440 }, (_, i) => {
          const angle = i * 2.39996
          const radius = 70 + Math.sqrt(i / 440) * 190
          return (
            <circle
              key={i}
              cx={350 + Math.cos(angle) * radius}
              cy={350 + Math.sin(angle) * radius * 0.8}
              r={i % 7 === 0 ? 2 : 1}
              fill={i % 4 ? '#a182f1' : '#f3eaff'}
              opacity={0.25 + (i % 6) / 9}
            />
          )
        })}
        <ellipse
          cx="350"
          cy="350"
          rx="248"
          ry="90"
          stroke="#ad8bff"
          strokeOpacity=".4"
          transform="rotate(-35 350 350)"
        />
        <ellipse
          cx="350"
          cy="350"
          rx="248"
          ry="90"
          stroke="#ad8bff"
          strokeOpacity=".25"
          transform="rotate(45 350 350)"
        />
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
  const [supported, setSupported] = useState<boolean | null>(null)
  const [visible, setVisible] = useState(true)
  const [failed, setFailed] = useState(false)
  const progress = useRef(0)

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
    const update = () => {
      progress.current = Math.min(
        1,
        Math.max(0, -target!.getBoundingClientRect().top / Math.max(window.innerHeight, 1)),
      )
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  useEffect(() => {
    if (opening && (supported === false || failed || !enabled)) onComplete()
  }, [opening, supported, failed, enabled, onComplete])

  const fallback = <StaticArt />
  return (
    <div className="hero-art" ref={container} aria-hidden="true">
      <div className="art-glow" />
      {enabled && supported && !failed ? (
        <ArtBoundary fallback={fallback} onFailure={() => setFailed(true)}>
          <Suspense fallback={fallback}>
            <ParticleCanvas
              visible={visible}
              progress={progress}
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
      <span className="orbit-label label-idea">01 / IDEA</span>
      <span className="orbit-label label-build">02 / BUILD</span>
      <span className="orbit-label label-launch">03 / LAUNCH</span>
      <div className="art-caption">
        <span /> IDEAS TAKING SHAPE
      </div>
    </div>
  )
}
