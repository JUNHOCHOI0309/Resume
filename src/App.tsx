import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { experiences, portfolio, skillGroups } from './data/portfolio'

type TransitionState = {
  from: number
  to: number
  phase: 'pre' | 'running'
}

const sceneItems = [
  { id: 'about', label: 'About', indexLabel: '01' },
  { id: 'overview', label: 'Overview', indexLabel: '02' },
  { id: 'experience', label: 'Experience', indexLabel: '03' },
  { id: 'skills', label: 'Skills', indexLabel: '04' },
  { id: 'contact', label: 'Contact', indexLabel: '05' },
] as const

const motionDurationMs = 760
const wheelThreshold = 120
const wheelResetDelay = 220

function App() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const activeIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const wheelBufferRef = useRef(0)
  const wheelResetTimeoutRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
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
    setTransition({ from: currentIndex, to: nextIndex, phase: 'pre' })

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
      transitionTimeoutRef.current = null
    }, motionDurationMs)
  }

  const jumpToSection = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= sceneItems.length) {
      return
    }

    if (window.innerWidth < 1024) {
      sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (Math.abs(nextIndex - activeIndexRef.current) > 1) {
      clearWheelBuffer()
      setTransition(null)
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      return
    }

    moveToSection(nextIndex)
  }

  const getPanelStyle = (index: number): CSSProperties => {
    const getStackStyle = (distance: number): CSSProperties => {
      if (distance < 0) {
        return {
          opacity: 0,
          transform: 'translate3d(0, -112%, 0) rotate(-1.5deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }
      }

      return {
        opacity: Math.max(0.62, 1 - distance * 0.1),
        transform: `translate3d(0, ${distance * 22}px, 0) scale(${Math.max(0.9, 1 - distance * 0.024)})`,
        transformOrigin: 'center top',
        filter: `brightness(${Math.max(0.82, 1 - distance * 0.05)})`,
        pointerEvents: distance === 0 ? 'auto' : 'none',
        zIndex: 10 - distance,
      }
    }

    if (!transition) {
      return getStackStyle(index - activeIndex)
    }

    const isMovingForward = transition.to > transition.from

    if (index === transition.from) {
      if (transition.phase === 'pre') {
        return getStackStyle(0)
      }

      return {
        opacity: 0,
        transform: isMovingForward
          ? 'translate3d(0, -118%, 0) rotate(-2deg)'
          : 'translate3d(0, 118%, 0) rotate(2deg)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
        zIndex: 12,
      }
    }

    if (index === transition.to && !isMovingForward && transition.phase === 'pre') {
      return {
        opacity: 0,
        transform: 'translate3d(0, -112%, 0) rotate(-1.5deg)',
        pointerEvents: 'none',
        zIndex: 11,
      }
    }

    const distance =
      transition.phase === 'pre' && isMovingForward
        ? index - transition.from
        : index - transition.to

    return getStackStyle(distance)
  }

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1024 || Math.abs(event.deltaY) < 10) {
        return
      }

      const scrollRegion = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-scene-scroll="true"]',
      )

      if (scrollRegion) {
        const remainingDown = scrollRegion.scrollHeight - scrollRegion.clientHeight - scrollRegion.scrollTop
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

      wheelResetTimeoutRef.current = window.setTimeout(clearWheelBuffer, wheelResetDelay)

      if (Math.abs(wheelBufferRef.current) < wheelThreshold) {
        return
      }

      moveToSection(
        Math.min(
          sceneItems.length - 1,
          Math.max(0, activeIndexRef.current + (wheelBufferRef.current > 0 ? 1 : -1)),
        ),
      )
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
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
                <article className="profile-card">
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

                <div className="about-copy-group">
                  <article className="info-card narrative-card">
                    <div className="paragraph-stack">
                      {portfolio.about.slice(0, 2).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      <p>
                        기획부터 구현, 배포까지 이어지는 과정에서 사용자의 실제 흐름과 운영 관점을 함께 고민합니다.
                      </p>
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
                  프로젝트 전체 내용을 한 흐름으로 확인한 뒤 다음 섹션으로 자연스럽게
                  이어집니다.
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
                          <h3>
                            {experience.name}
                            {experience.url && (
                              <a
                                className="experience-link"
                                href={experience.url}
                                rel="noreferrer"
                                target="_blank"
                              >
                                {experience.urlLabel}
                              </a>
                            )}
                          </h3>
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
