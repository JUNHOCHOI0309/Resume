import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { profile, projects } from './data/content'
import { MotionProvider, useMotion, useReveal } from './lib/motion'
import { getMetadata } from './lib/metadata'
import { ProjectCard, ProjectContribution, ProjectVisual } from './components/ProjectCard'
import LandingHero from './components/LandingHero'
import AIUsage from './components/AIUsage'
import StarBackdrop from './components/StarBackdrop'

const navigation = [
  { id: 'work', name: '포트폴리오', english: 'Work' },
  { id: 'ai-usage', name: 'AI 활용', english: 'Tools' },
  { id: 'about', name: '소개', english: 'About' },
  { id: 'contact', name: '연락', english: 'Contact' },
]

function Header() {
  const { pathname } = useLocation()
  const { enabled, toggle } = useMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    if (pathname !== '/') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    navigation.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [pathname])
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
        }
      }}
    >
      <Link className="wordmark" to="/" aria-label="최준호 포트폴리오 홈">
        <span className="wordmark-icon" aria-hidden="true">
          j<span>.</span>
        </span>
        <span>
          CHOI JUN HO<span className="wordmark-sub">DEVELOPER PORTFOLIO</span>
        </span>
      </Link>
      <nav
        className={`main-nav ${menuOpen ? 'is-open' : ''}`}
        id="main-navigation"
        aria-label="주요 메뉴"
      >
        {navigation.map((item) => (
          <Link
            key={item.id}
            className={
              (pathname.startsWith('/work') ? item.id === 'work' : active === item.id)
                ? 'active'
                : ''
            }
            to={`/#${item.id}`}
            onClick={() => setMenuOpen(false)}
          >
            <span>{item.name}</span>
            <small>{item.english}</small>
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="motion-toggle"
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? '움직이는 효과 끄기' : '움직이는 효과 켜기'}
        >
          <span className={enabled ? 'motion-dot active' : 'motion-dot'} />{' '}
          <span>MOTION {enabled ? 'ON' : 'OFF'}</span>
        </button>
        <button
          className="menu-toggle"
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '닫기' : '메뉴'}
          <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer container">
      <Link to="/" className="footer-name">
        CHOI JUN HO<span>웹 개발자 최준호</span>
      </Link>
      <span>© {new Date().getFullYear()} CHOI JUN HO</span>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </footer>
  )
}

function BackToTop() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { enabled } = useMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])

  if (!visible) return null

  return (
    <button
      className="back-to-top"
      aria-label="페이지 맨 위로"
      onClick={() => {
        void navigate({ hash: '#top' }, { replace: true })
        window.scrollTo({ top: 0, behavior: enabled ? 'smooth' : 'instant' })
        document.querySelector<HTMLAnchorElement>('.wordmark')?.focus({ preventScroll: true })
      }}
    >
      맨 위로
    </button>
  )
}

function Contact() {
  return (
    <section className="contact-section container" id="contact">
      <div className="eyebrow reveal">
        <span>04 / CONTACT</span>
      </div>
      <div className="contact-heading reveal">
        <h2>연락처</h2>
        <a
          className="button button-outline"
          href={`mailto:${profile.email}`}
          aria-label="최준호에게 이메일 보내기"
        >
          이메일
        </a>
      </div>
      <div className="contact-bottom reveal">
        <p>프로젝트 문의는 이메일로 부탁드립니다.</p>
        <div>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="contact-email" href={`mailto:${profile.secondaryEmail}`}>
            {profile.secondaryEmail}
          </a>
          <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <LandingHero />
      <section className="ownership-section container" aria-labelledby="ownership-title">
        <div className="ownership-heading reveal">
          <span className="small-label">PERSONAL PROJECTS</span>
          <h2 id="ownership-title">개인 프로젝트</h2>
          <p>WHICH와 데일리 브리프는 혼자 기획하고 개발·운영하는 서비스입니다.</p>
        </div>
        <div className="ownership-grid">
          {projects
            .filter((project) => project.solo)
            .map((project) => (
              <Link
                key={project.slug}
                className="ownership-card reveal"
                to={`/work/${project.slug}`}
              >
                <span className="ownership-label">1인 프로젝트</span>
                <h3>{project.name}</h3>
                <p>{project.contribution}</p>
                <strong>기획 · 디자인 · 개발 · 배포 · 운영</strong>
              </Link>
            ))}
        </div>
        <p className="ai-assistance reveal">
          두 서비스의 기획, 디자인, 기능 확인, 배포와 운영을 담당했습니다. 코드 구현에는 Codex의
          도움을 받았습니다.
        </p>
      </section>
      <section className="work-section container section-space" id="work">
        <div className="eyebrow reveal">
          <span>01 / SELECTED WORK</span>
        </div>
        <div className="section-heading reveal">
          <h2>포트폴리오</h2>
          <p>
            프로젝트별 기능과 담당 범위를 정리했습니다.
            <br />
            <Link className="text-link" to="/work">
              모든 프로젝트 <span className="count">{projects.length}</span>
            </Link>
          </p>
        </div>
        <div className="project-grid">
          {projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
        </div>
        <div className="work-more reveal">
          <span>웹 게임, 모바일 앱과 팀 프로젝트</span>
          <Link className="button button-outline" to="/work">
            전체 프로젝트
          </Link>
        </div>
      </section>
      <AIUsage />
      <section className="about-section container section-space" id="about">
        <div className="eyebrow reveal">
          <span>03 / ABOUT</span>
        </div>
        <div className="about-layout">
          <div className="about-manifesto reveal">
            <h2>소개</h2>
            <span className="signature">
              Junho Choi<span>SOFTWARE DEVELOPER</span>
            </span>
          </div>
          <div className="about-copy reveal">
            <p>{profile.introduction}</p>
            <p>
              병원 홈페이지 외주 제작을 시작으로 웹 게임, Android 앱, 팀 프로젝트와 대회 결제
              서비스를 개발했습니다. 현재는 WHICH와 데일리 브리프를 개발·운영하고 있습니다.
            </p>
            <p>
              화면 개발과 서버 API, 데이터베이스 설계, 배포를 맡아 왔습니다. 팀 프로젝트에서는
              백엔드 팀장과 Git·PR 관리도 담당했습니다.
            </p>
            <div className="about-principles">
              <div>
                <span>01</span>
                <strong>화면 개발</strong>
                <p>React와 Next.js로 웹 화면을 개발했습니다.</p>
              </div>
              <div>
                <span>02</span>
                <strong>서버 개발</strong>
                <p>Express, Fastify, Spring으로 API와 서버를 개발했습니다.</p>
              </div>
              <div>
                <span>03</span>
                <strong>배포·운영</strong>
                <p>Cloudflare, Vercel, OCI 환경에 서비스를 배포했습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  )
}

function Work() {
  const [filter, setFilter] = useState('전체')
  const filtered = projects.filter((item) => filter === '전체' || item.category === filter)
  return (
    <>
      <section className="work-page container section-space">
        <div className="eyebrow">
          <span>PORTFOLIO</span>
          <span>{String(projects.length).padStart(2, '0')} PROJECTS</span>
        </div>
        <h1>프로젝트 목록</h1>
        <p className="page-description">웹 서비스, 웹사이트, 게임과 앱 개발 기록입니다.</p>
        <div className="work-filters" role="group" aria-label="프로젝트 분야">
          {['전체', '서비스', '웹사이트', '게임 · 앱'].map((label) => (
            <button
              key={label}
              aria-pressed={filter === label}
              className={filter === label ? 'active' : ''}
              onClick={() => setFilter(label)}
            >
              {label}
              <span>
                {label === '전체'
                  ? projects.length
                  : projects.filter((p) => p.category === label).length}
              </span>
            </button>
          ))}
        </div>
        <div className="project-grid" key={filter}>
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
        <p className="archive-note">
          공개 여부가 확인된 서비스에는 ‘공개 서비스’ 표시를 붙였습니다. 그 외 작업은 구현 기록을
          중심으로 소개합니다.
        </p>
      </section>
      <Contact />
    </>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((project) => project.slug === slug)
  const project = projects[index]
  if (!project) return <NotFound />
  const next = projects[(index + 1) % projects.length]
  return (
    <article className="case-study container">
      <Link className="back-link" to="/work">
        프로젝트 목록
      </Link>
      <div className="eyebrow">
        <span>{project.eyebrow}</span>
        <span>{project.status === 'live' ? '공개 서비스' : '프로젝트 기록'}</span>
      </div>
      <div className="case-heading">
        <div>
          <p className="case-name">{project.name}</p>
          <h1>{project.headline}</h1>
        </div>
        <p>{project.description}</p>
      </div>
      <dl className="case-facts">
        {project.role && (
          <div>
            <dt>담당 범위</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {project.period && (
          <div>
            <dt>작업 기간</dt>
            <dd>{project.period}</dd>
          </div>
        )}
        <div>
          <dt>{project.slug === 'daily-brief' ? '확인할 수 있는 기능' : '사용한 기술'}</dt>
          <dd>{project.stack.join(' / ')}</dd>
        </div>
        {project.demoUrl && (
          <div>
            <dt>사이트</dt>
            <dd>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                {project.status === 'live' ? '사이트 방문' : '기존 사이트'}
              </a>
            </dd>
          </div>
        )}
      </dl>
      <section className="case-ownership" aria-label="프로젝트 담당 범위">
        <ProjectContribution project={project} detailed />
      </section>
      <div className="case-cover">
        <ProjectVisual project={project} priority />
      </div>
      <div className="case-content">
        <section className="case-block reveal">
          <span className="small-label">01 / WHY</span>
          <div>
            <h2>제작 배경</h2>
            <p>{project.problem}</p>
          </div>
        </section>
        <section className="case-block reveal">
          <span className="small-label">02 / HOW IT WORKS</span>
          <div>
            <h2>구현 방식</h2>
            <p>{project.approach}</p>
            <ol className="case-flow">
              {project.flow.map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="case-block reveal">
          <span className="small-label">03 / WHAT WAS BUILT</span>
          <div>
            <h2>개발 내용</h2>
            <div className="feature-list">
              {project.highlights.map((item, i) => (
                <div key={item.title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {project.decisions && (
              <details className="technical-notes">
                <summary>기술 선택</summary>
                {project.decisions.map((item) => (
                  <div key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </details>
            )}
          </div>
        </section>
        <section className="case-block reveal">
          <span className="small-label">04 / TAKEAWAY</span>
          <div>
            <h2>작업 정리</h2>
            <p>{project.takeaway}</p>
            <p className="evidence-note">{project.evidence}</p>
            <div className="hero-actions">
              {project.demoUrl && (
                <a
                  className="button button-primary"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.status === 'live' ? '사이트 방문' : '기존 사이트'}
                </a>
              )}
              <Link className="button button-outline" to="/work">
                프로젝트 목록
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Link className="next-project" to={`/work/${next.slug}`}>
        <span className="small-label">다음 프로젝트</span>
        <strong>{next.name}</strong>
      </Link>
    </article>
  )
}

function NotFound() {
  return (
    <section className="not-found container">
      <span className="small-label">404</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link className="button button-primary" to="/work">
        프로젝트 목록
      </Link>
    </section>
  )
}

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    const meta = getMetadata(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.url)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', meta.url)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', meta.description)
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute('content', meta.notFound ? 'noindex, follow' : 'index, follow')
    const frame = requestAnimationFrame(() => {
      if (hash)
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      if (previousPath.current !== pathname) {
        const heading = document.querySelector<HTMLElement>('main h1')
        heading?.setAttribute('tabindex', '-1')
        heading?.focus({ preventScroll: true })
        previousPath.current = pathname
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

function Site() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  useReveal(main, pathname)
  return (
    <div className="site-shell">
      <StarBackdrop />
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <div id="top" />
      <Header key={pathname} />
      <RouteEffects />
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default function Portfolio() {
  return (
    <MotionProvider>
      <Site />
    </MotionProvider>
  )
}
