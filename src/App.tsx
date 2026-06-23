import { experiences, portfolio, skillGroups } from './data/portfolio'

function App() {
  return (
    <div className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="page">
        <header className="site-bar">
          <a className="brand" href="#top">
            {portfolio.englishName}
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero-shell" id="top">
          <div className="hero-copy">
            <p className="eyebrow">PORTFOLIO / FULL-STACK WEB DEVELOPER</p>
            <h1 className="hero-title">
              {portfolio.heroLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="hero-summary">{portfolio.summary}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#experience">
                View Experience
              </a>
              <a
                className="button button-secondary"
                href={portfolio.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>

            <dl className="metric-grid">
              {portfolio.metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="identity-card">
            <div className="portrait-frame">
              <img
                src={portfolio.profileImage}
                alt={`${portfolio.name} profile portrait`}
              />
            </div>

            <div className="identity-body">
              <p className="card-kicker">PROFILE</p>
              <h2>
                {portfolio.name}
                <small>{portfolio.englishName}</small>
              </h2>
              <p className="identity-role">{portfolio.role}</p>

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
          </aside>
        </section>

        <section className="section-panel" id="about">
          <div className="section-heading">
            <p className="section-index">01</p>
            <div>
              <p className="section-label">About</p>
              <h2>서비스를 사용하는 흐름까지 생각하며 구현합니다.</h2>
            </div>
          </div>

          <div className="intro-grid">
            <div className="intro-copy">
              {portfolio.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="principles-grid">
              {portfolio.principles.map((principle) => (
                <article className="principle-card" key={principle.title}>
                  <p className="principle-index">{principle.title}</p>
                  <p>{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-panel">
          <div className="section-heading">
            <p className="section-index">02</p>
            <div>
              <p className="section-label">Overview</p>
              <h2>프로젝트 경험을 최신 순으로 정리했습니다.</h2>
            </div>
          </div>

          <div className="overview-grid">
            {portfolio.overview.map((item, index) => (
              <article className="overview-card" key={item}>
                <p className="overview-order">{String(index + 1).padStart(2, '0')}</p>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-panel" id="experience">
          <div className="section-heading">
            <p className="section-index">03</p>
            <div>
              <p className="section-label">Experience</p>
              <h2>기획에서 배포까지, 역할이 보이는 프로젝트 기록</h2>
            </div>
          </div>

          <div className="timeline-list">
            {experiences.map((experience, index) => (
              <article className="timeline-item" key={experience.name}>
                <div className="timeline-period">
                  <p className="timeline-order">{String(index + 1).padStart(2, '0')}</p>
                  <p>{experience.period}</p>
                </div>

                <div className="timeline-content">
                  <div className="timeline-topline">
                    <div>
                      <h3>{experience.name}</h3>
                      <p className="timeline-role">{experience.role}</p>
                    </div>
                    <span className="timeline-badge">Project</span>
                  </div>

                  <p className="timeline-summary">{experience.summary}</p>

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
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-panel" id="skills">
          <div className="section-heading">
            <p className="section-index">04</p>
            <div>
              <p className="section-label">Skills</p>
              <h2>프로젝트에서 반복적으로 사용한 기술 스택</h2>
            </div>
          </div>

          <div className="skills-grid">
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
        </section>

        <footer className="footer-card" id="contact">
          <div>
            <p className="section-label">Contact</p>
            <h2>함께 만들 서비스가 있다면 바로 이야기할 수 있습니다.</h2>
          </div>

          <div className="footer-actions">
            <a className="button button-primary" href={`mailto:${portfolio.email}`}>
              {portfolio.email}
            </a>
            <a
              className="button button-secondary"
              href={portfolio.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub Repository
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
