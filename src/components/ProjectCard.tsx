import { type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { type Project } from '../data/content'
import { useMotion } from '../lib/motion'

export function ProjectVisual({
  project,
  priority = false,
}: {
  project: Project
  priority?: boolean
}) {
  return (
    <div className={`project-visual art-${project.art}`}>
      <div className="visual-orbit" aria-hidden="true" />
      {project.image ? (
        <div className="browser-frame">
          <div className="browser-top" aria-hidden="true">
            <span />
            <span />
            <span />
            <i>{new URL(project.demoUrl!).hostname}</i>
          </div>
          <img
            src={project.image}
            alt={project.imageAlt}
            width="1280"
            height="720"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ) : (
        <div className="flow-art">
          <span className="flow-mark" aria-hidden="true">
            {project.art === 'security'
              ? '{ / }'
              : project.art === 'payment'
                ? 'M / M'
                : project.art === 'game'
                  ? 'O + O'
                  : project.art === 'medical'
                    ? '+'
                    : '···'}
          </span>
          <strong>{project.name}</strong>
          <div className="flow-art-steps">
            {project.flow.slice(0, 3).map((step, index) => (
              <span key={step}>
                <b>0{index + 1}</b>
                {step}
              </span>
            ))}
          </div>
        </div>
      )}
      <span className="visual-caption">
        {project.image ? '실제 서비스 화면' : '구현 기능을 설명하는 흐름도'}
      </span>
    </div>
  )
}

export function ProjectContribution({
  project,
  detailed = false,
}: {
  project: Project
  detailed?: boolean
}) {
  return (
    <div className="project-contribution">
      <div className="contribution-label">
        <strong>담당 범위</strong>
        {project.solo && <span>1인 프로젝트</span>}
      </div>
      <p className="contribution-summary">{project.contribution}</p>
      <ul className="responsibility-list">
        {project.responsibilities.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      {project.developmentNote && (
        <p className="development-note">
          {detailed ? project.developmentNote : '개인 프로젝트. 코드 구현에 Codex를 활용했습니다.'}
        </p>
      )}
      <div className="contribution-result">
        <span>주요 기능</span>
        <p>{project.result}</p>
      </div>
    </div>
  )
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { enabled } = useMotion()
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      '--tilt-x',
      `${-((event.clientY - box.top) / box.height - 0.5) * 4}deg`,
    )
    event.currentTarget.style.setProperty(
      '--tilt-y',
      `${((event.clientX - box.left) / box.width - 0.5) * 5}deg`,
    )
  }
  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }
  return (
    <article
      className="project-card reveal"
      onPointerMove={tilt}
      onPointerLeave={reset}
      style={{ '--project-order': index } as CSSProperties}
    >
      <Link
        className="project-cover-link"
        to={`/work/${project.slug}`}
        aria-label={`${project.name} 프로젝트 상세`}
      >
        <ProjectVisual project={project} />
      </Link>
      <div className="project-meta">
        <span>
          {String(index + 1).padStart(2, '0')} / {project.eyebrow}
        </span>
        <span className={`project-status ${project.status}`}>
          {project.status === 'live' ? '공개 서비스' : '프로젝트 기록'}
        </span>
      </div>
      <div className="project-title-row">
        <h3>
          <Link to={`/work/${project.slug}`}>{project.name}</Link>
        </h3>
        <Link
          className="project-detail-link"
          to={`/work/${project.slug}`}
          aria-label={`${project.name} 상세 보기`}
        >
          상세
        </Link>
      </div>
      <p className="project-headline">{project.headline.replace('\n', ' ')}</p>
      <p className="project-description">{project.description}</p>
      <ProjectContribution project={project} />
      <div className="project-bottom">
        <span>{project.role ?? project.category}</span>
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            {project.status === 'live' ? '사이트 방문' : '기존 사이트'}
          </a>
        )}
      </div>
    </article>
  )
}
