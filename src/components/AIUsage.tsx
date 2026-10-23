import { useState } from 'react'
import { Link } from 'react-router-dom'
import { aiTools, aiUsageCases } from '../data/aiUsage'

export default function AIUsage() {
  const [selected, setSelected] = useState(aiUsageCases[0].id)
  const current = aiUsageCases.find((item) => item.id === selected) ?? aiUsageCases[0]

  return (
    <section
      className="ai-usage-section section-space"
      id="ai-usage"
      aria-labelledby="ai-usage-title"
    >
      <span id="engineering" className="section-anchor" aria-hidden="true" />
      <div className="container">
        <div className="eyebrow reveal">
          <span>02 / AI TOOLS</span>
        </div>
        <div className="section-heading reveal">
          <h2 id="ai-usage-title">AI 활용 범위</h2>
          <p>
            웹·모바일 서비스와 데이터 처리,
            <br />
            로컬 AI 도구 제작에 ChatGPT와 Codex를 활용했습니다.
          </p>
        </div>

        <div className="ai-examples reveal">
          <h3 className="ai-examples-title">실제로 구현한 작업</h3>
          <div className="ai-case-layout">
            <div className="ai-case-list" role="group" aria-label="AI 활용 프로젝트 선택">
              {aiUsageCases.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={current.id === item.id}
                  aria-controls="ai-case-detail"
                  onClick={() => setSelected(item.id)}
                >
                  <span className="ai-case-number">0{index + 1}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.reach}</small>
                  </span>
                </button>
              ))}
            </div>

            <article
              className="ai-case-detail"
              id="ai-case-detail"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="small-label">{current.category}</p>
              <h4>{current.name}</h4>
              <p className="ai-case-outcome">{current.outcome}</p>
              <p className="ai-case-description">{current.description}</p>
              <ol className="ai-build-list" aria-label="구현한 범위">
                {current.builds.map((build, index) => (
                  <li key={build.title}>
                    <span aria-hidden="true">0{index + 1}</span>
                    <div>
                      <h5>{build.title}</h5>
                      <p>{build.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <section
                className="ai-work-example"
                aria-label={`${current.name} 구체적인 작업 사례`}
              >
                <p className="small-label">구체적인 작업 사례</p>
                <h5>{current.example.title}</h5>
                <dl>
                  <div>
                    <dt>조건</dt>
                    <dd>{current.example.requirement}</dd>
                  </div>
                  <div>
                    <dt>AI와 구현</dt>
                    <dd>{current.example.implementation}</dd>
                  </div>
                  <div>
                    <dt>확인한 항목</dt>
                    <dd>{current.example.verification}</dd>
                  </div>
                </dl>
              </section>

              <details className="ai-case-tool-details">
                <summary>이 작업에서 ChatGPT와 Codex를 쓴 부분</summary>
                <dl className="ai-case-tools">
                  <div>
                    <dt>ChatGPT</dt>
                    <dd>{current.chatgpt}</dd>
                  </div>
                  <div>
                    <dt>Codex</dt>
                    <dd>{current.codex}</dd>
                  </div>
                </dl>
              </details>
              {current.note && <p className="ai-case-note">{current.note}</p>}
              {current.detailPath && (
                <Link className="ai-case-link" to={current.detailPath}>
                  프로젝트 상세
                </Link>
              )}
              {current.siteUrl && (
                <a
                  className="ai-case-link"
                  href={current.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  프로젝트 사이트
                </a>
              )}
            </article>
          </div>
        </div>

        <details className="ai-tool-details">
          <summary>도구별 활용 방식</summary>
          <dl className="ai-tool-list">
            {aiTools.map((tool) => (
              <div className="ai-tool-row" key={tool.name}>
                <dt>{tool.name}</dt>
                <dd>
                  <h3>{tool.role}</h3>
                  <p>{tool.description}</p>
                  <ul className="ai-task-list" aria-label={`${tool.name} 활용 범위`}>
                    {tool.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  )
}
