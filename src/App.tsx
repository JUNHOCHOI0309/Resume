import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { experiences, portfolio, skillGroups } from './data/portfolio'

type DirectionVector = {
  x: number
  y: number
}

type TransitionState = {
  from: number
  to: number
  vector: DirectionVector
  phase: 'pre' | 'running'
}

const sceneItems = [
  { id: 'about', label: 'About', indexLabel: '01' },
  { id: 'overview', label: 'Overview', indexLabel: '02' },
  { id: 'experience', label: 'Experience', indexLabel: '03' },
  { id: 'skills', label: 'Skills', indexLabel: '04' },
  { id: 'contact', label: 'Contact', indexLabel: '05' },
] as const

const transitionVectors: DirectionVector[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
]

const motionDurationMs = 860
const wheelThreshold = 120
const wheelResetDelay = 220

function App() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const activeIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const wheelBufferRef = useRef(0)
  const wheelResetTimeoutRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const reduceMotionQueryRef = useRef<MediaQueryList | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [transition, setTransition] = useState<TransitionState | null>(null)

  const clearWheelBuffer = () => {
    wheelBufferRef.current = 0

    if (wheelResetTimeoutRef.current !== null) {
      window.clearTimeout(wheelResetTimeoutRef.current)
      wheelResetTimeoutRef.current = null
    }
  }

  const finishTransition = (nextIndex: number) => {
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
    setTransition(null)
    isAnimatingRef.current = false
  }

  const getVectorForMove = (fromIndex: number, toIndex: number): DirectionVector => {
    if (toIndex > fromIndex) {
      return transitionVectors[Math.min(fromIndex, transitionVectors.length - 1)]
    }

    if (toIndex < fromIndex) {
      const baseVector = transitionVectors[Math.max(0, toIndex)]
      return { x: -baseVector.x, y: -baseVector.y }
    }

    return { x: 0, y: 0 }
  }

  const moveToSection = (nextIndex: number) => {
    const currentIndex = activeIndexRef.current

    if (
      nextIndex < 0 ||
      nextIndex >= sceneItems.length ||
      nextIndex === currentIndex ||
      isAnimatingRef.current
    ) {
      return
    }

    clearWheelBuffer()

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current)
    }

    isAnimatingRef.current = true

    const vector = getVectorForMove(currentIndex, nextIndex)

    setTransition({
      from: currentIndex,
      to: nextIndex,
      vector,
      phase: 'pre',
    })

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransition((previous) =>
          previous
            ? {
                ...previous,
                phase: 'running',
              }
            : previous,
        )
      })
    })

    transitionTimeoutRef.current = window.setTimeout(() => {
      finishTransition(nextIndex)
    }, motionDurationMs)
  }

  const jumpToSection = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= sceneItems.length) {
      return
    }

    if (window.innerWidth < 1024) {
      sectionRefs.current[nextIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }

    if (Math.abs(nextIndex - activeIndexRef.current) > 1) {
      clearWheelBuffer()

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      setTransition(null)
      isAnimatingRef.current = false
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      return
    }

    moveToSection(nextIndex)
  }

  const getPanelStyle = (index: number): CSSProperties => {
    const hiddenStyle: CSSProperties = {
      opacity: 0,
      transform: 'translate3d(0, 0, 0) scale(0.985)',
      filter: 'blur(18px)',
      pointerEvents: 'none',
      zIndex: 0,
    }

    const activeStyle: CSSProperties = {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      filter: 'blur(0px)',
      pointerEvents: 'auto',
      zIndex: 3,
    }

    if (!transition) {
      return index === activeIndex ? activeStyle : hiddenStyle
    }

    if (index === transition.from) {
      if (transition.phase === 'pre') {
        return {
          ...activeStyle,
          zIndex: 2,
        }
      }

      return {
        opacity: 0,
        transform: `translate3d(${-transition.vector.x * 18}%, ${-transition.vector.y * 18}%, 0) scale(0.94)`,
        filter: 'blur(18px)',
        pointerEvents: 'none',
        zIndex: 2,
      }
    }

    if (index === transition.to) {
      if (transition.phase === 'pre') {
        return {
          opacity: 1,
          transform: `translate3d(${transition.vector.x * 108}%, ${transition.vector.y * 108}%, 0) scale(1)`,
          filter: 'blur(0px)',
          pointerEvents: 'none',
          zIndex: 3,
        }
      }

      return activeStyle
    }

    return hiddenStyle
  }

  useEffect(() => {
    reduceMotionQueryRef.current = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleWheel = (event: WheelEvent) => {
      if (
        reduceMotionQueryRef.current?.matches ||
        window.innerWidth < 1024 ||
        Math.abs(event.deltaY) < 10
      ) {
        return
      }

      const scrollRegion = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-scene-scroll="true"]',
      )

      if (scrollRegion) {
        const remainingDown =
          scrollRegion.scrollHeight -
          scrollRegion.clientHeight -
          scrollRegion.scrollTop

        const canScrollDown = event.deltaY > 0 && remainingDown > 4
        const canScrollUp = event.deltaY < 0 && scrollRegion.scrollTop > 4

        if (canScrollDown || canScrollUp) {
          return
        }
      }

      event.preventDefault()

      if (isAnimatingRef.current) {
        return
      }

      wheelBufferRef.current += event.deltaY

      if (wheelResetTimeoutRef.current !== null) {
        window.clearTimeout(wheelResetTimeoutRef.current)
      }

      wheelResetTimeoutRef.current = window.setTimeout(() => {
        wheelBufferRef.current = 0
        wheelResetTimeoutRef.current = null
      }, wheelResetDelay)

      if (Math.abs(wheelBufferRef.current) < wheelThreshold) {
        return
      }

      const direction = wheelBufferRef.current > 0 ? 1 : -1
      const nextIndex = Math.min(
        sceneItems.length - 1,
        Math.max(0, activeIndexRef.current + direction),
      )

      moveToSection(nextIndex)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        reduceMotionQueryRef.current?.matches ||
        window.innerWidth < 1024 ||
        isAnimatingRef.current
      ) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        moveToSection(Math.min(sceneItems.length - 1, activeIndexRef.current + 1))
      }

      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        moveToSection(Math.max(0, activeIndexRef.current - 1))
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      clearWheelBuffer()

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="presentation-shell">
        <header className="site-bar">
          <a className="brand" href="#about">
            {portfolio.englishName}
          </a>

          <nav className="site-nav" aria-label="Section Navigation">
            {sceneItems.map((scene, index) => (
              <button
                key={scene.id}
                className={`nav-link ${activeIndex === index ? 'is-active' : ''}`}
                onClick={() => jumpToSection(index)}
                type="button"
              >
                <span>{scene.indexLabel}</span>
                {scene.label}
              </button>
            ))}
          </nav>

          <div className="status-pill" aria-live="polite">
            <span>{sceneItems[activeIndex].indexLabel}</span>
            <strong>{sceneItems[activeIndex].label}</strong>
          </div>
        </header>

        <div className="section-stage">
          <section
            className="scene-panel scene-about"
            id="about"
            ref={(node) => {
              sectionRefs.current[0] = node
            }}
            style={getPanelStyle(0)}
          >
            <div className="scene-stack">
              <div className="scene-header-block">
                <p className="scene-kicker">Section 01 / About</p>
                <h1 className="scene-title">
                  사용자 흐름을 끝까지 구현하는
                  <br />
                  개발자 최준호
                </h1>
                <p className="scene-description">{portfolio.summary}</p>
              </div>

              <div className="scene-body scene-scroll-body about-body" data-scene-scroll="true">
                <div className="about-copy-group">
                  <article className="info-card narrative-card">
                    <div className="paragraph-stack">
                      {portfolio.about.slice(0, 2).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>

                  <div className="hero-actions">
                    <button
                      className="button button-primary"
                      onClick={() => jumpToSection(2)}
                      type="button"
                    >
                      View Experience
                    </button>
                    <a
                      className="button button-secondary"
                      href={portfolio.github}
                      rel="noreferrer"
                      target="_blank"
                    >
                      GitHub
                    </a>
                  </div>
                </div>

                <article className="profile-card">
                  <div className="profile-portrait">
                    <img
                      alt={`${portfolio.name} profile portrait`}
                      src={portfolio.profileImage}
                    />
                  </div>

                  <div className="profile-content">
                    <p className="profile-kicker">Profile</p>
                    <h2>
                      {portfolio.name}
                      <small>{portfolio.englishName}</small>
                    </h2>
                    <p className="profile-role">{portfolio.role}</p>

                    <ul className="contact-list">
                      <li>
                        <span>Location</span>
                        <strong>{portfolio.location}</strong>
                      </li>
                      <li>
                        <span>Phone</span>
                        <a href={`tel:${portfolio.phone.replaceAll('-', '')}`}>
                          {portfolio.phone}
                        </a>
                      </li>
                      <li>
                        <span>Email</span>
                        <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
                      </li>
                    </ul>
                  </div>
                </article>

                <dl className="metric-grid about-metrics">
                  {portfolio.metrics.map((metric) => (
                    <div className="metric-card" key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="principles-grid about-principles">
                  {portfolio.principles.map((principle) => (
                    <article className="principle-card" key={principle.title}>
                      <p className="principle-title">{principle.title}</p>
                      <p>{principle.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className="scene-panel scene-overview"
            id="overview"
            ref={(node) => {
              sectionRefs.current[1] = node
            }}
            style={getPanelStyle(1)}
          >
            <div className="scene-stack">
              <div className="scene-header-block">
                <p className="scene-kicker">Section 02 / Overview</p>
                <h2 className="scene-heading">프로젝트 경험을 한눈에 읽히도록 정리합니다.</h2>
                <p className="scene-description">
                  외주, 모바일 앱, 게임, 교육형 웹서비스, 팀 프로젝트, 결제 서비스까지
                  경험 범위를 넓혀왔습니다.
                </p>
              </div>

              <div className="scene-body scene-scroll-body overview-body" data-scene-scroll="true">
                <div className="overview-grid">
                  {portfolio.overview.map((item, index) => (
                    <article className="overview-card" key={item}>
                      <p className="overview-order">{String(index + 1).padStart(2, '0')}</p>
                      <p>{item}</p>
                    </article>
                  ))}
                </div>

                <div className="overview-notes">
                  <div className="info-card">
                    <p className="info-label">Working Style</p>
                    <p>
                      화면 구현에 그치지 않고 API, 데이터베이스, 운영 흐름, 관리자 기능까지
                      함께 설계합니다.
                    </p>
                  </div>

                  <div className="info-card">
                    <p className="info-label">Reference</p>
                    <a href={portfolio.github} rel="noreferrer" target="_blank">
                      {portfolio.github}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="scene-panel scene-experience"
            id="experience"
            ref={(node) => {
              sectionRefs.current[2] = node
            }}
            style={getPanelStyle(2)}
          >
            <div className="scene-stack">
              <div className="scene-header-block">
                <p className="scene-kicker">Section 03 / Experience</p>
                <h2 className="scene-heading">맡은 역할과 구현 범위가 분명하게 보이는 프로젝트 기록</h2>
                <p className="scene-description">
                  이 섹션은 내부 스크롤이 가능하며, 카드 내용을 충분히 본 뒤 다음
                  섹션으로 넘어가도록 구성했습니다.
                </p>
              </div>

              <div className="scene-body experience-body">
                <div className="chip-row">
                  <span className="chip">Planning</span>
                  <span className="chip">Frontend</span>
                  <span className="chip">Backend</span>
                  <span className="chip">Deployment</span>
                </div>

                <div className="experience-scroll" data-scene-scroll="true">
                  {experiences.map((experience) => (
                    <article className="experience-card" key={experience.name}>
                      <div className="experience-topline">
                        <div>
                          <p className="experience-period">{experience.period}</p>
                          <h3>{experience.name}</h3>
                          <p className="experience-role">{experience.role}</p>
                        </div>
                        <span className="timeline-badge">Project</span>
                      </div>

                      <p className="experience-summary">{experience.summary}</p>

                      <ul className="bullet-list">
                        {experience.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>

                      <div className="tag-row">
                        {experience.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className="scene-panel scene-skills"
            id="skills"
            ref={(node) => {
              sectionRefs.current[3] = node
            }}
            style={getPanelStyle(3)}
          >
            <div className="scene-stack">
              <div className="scene-header-block">
                <p className="scene-kicker">Section 04 / Skills</p>
                <h2 className="scene-heading">반복해서 사용한 기술 스택을 역할별로 정리했습니다.</h2>
                <p className="scene-description">
                  프론트엔드, 백엔드, 언어, 운영 관점에서 실제 사용 비중과 익숙도를
                  보여줍니다.
                </p>
              </div>

              <div className="scene-body scene-scroll-body skills-body" data-scene-scroll="true">
                <div className="skills-board">
                  {skillGroups.map((group) => (
                    <article className="skill-card" key={group.category}>
                      <div className="skill-card-header">
                        <h3>{group.category}</h3>
                        <p>{group.description}</p>
                      </div>

                      <div className="skill-list">
                        {group.items.map((item) => (
                          <div className="skill-row" key={item.name}>
                            <div className="skill-meta">
                              <span>{item.name}</span>
                              <strong>{item.level}</strong>
                            </div>
                            <div className="skill-track" aria-hidden="true">
                              <span style={{ width: `${item.level}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className="scene-panel scene-contact"
            id="contact"
            ref={(node) => {
              sectionRefs.current[4] = node
            }}
            style={getPanelStyle(4)}
          >
            <div className="scene-stack">
              <div className="scene-header-block">
                <p className="scene-kicker">Section 05 / Contact</p>
                <h2 className="scene-heading">함께 만들 서비스가 있다면 바로 이야기할 수 있습니다.</h2>
                <p className="scene-description">
                  사용자 흐름을 실제 서비스로 구현하는 웹 개발자로 계속 성장하고
                  있습니다.
                </p>
              </div>

              <div className="scene-body scene-scroll-body contact-body" data-scene-scroll="true">
                <div className="hero-actions">
                  <a className="button button-primary" href={`mailto:${portfolio.email}`}>
                    {portfolio.email}
                  </a>
                  <a
                    className="button button-secondary"
                    href={portfolio.github}
                    rel="noreferrer"
                    target="_blank"
                  >
                    GitHub Repository
                  </a>
                </div>

                <div className="contact-grid">
                  <article className="info-card contact-card">
                    <p className="info-label">Location</p>
                    <strong>{portfolio.location}</strong>
                    <p>Seoul based, available for frontend and full-stack web work.</p>
                  </article>

                  <article className="info-card contact-card">
                    <p className="info-label">Direct Contact</p>
                    <a href={`tel:${portfolio.phone.replaceAll('-', '')}`}>{portfolio.phone}</a>
                    <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
                  </article>

                  <article className="info-card contact-card">
                    <p className="info-label">Current Focus</p>
                    <p>React 기반 서비스 구현, API 설계, 운영을 고려한 관리자 기능 구성.</p>
                  </article>

                  <article className="info-card contact-card">
                    <p className="info-label">Reference</p>
                    <a href={portfolio.github} rel="noreferrer" target="_blank">
                      {portfolio.github}
                    </a>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
