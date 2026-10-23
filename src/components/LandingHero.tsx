import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/content'
import { useMotion } from '../lib/motion'
import HeroArt from './HeroArt'

const openingCopy = ['흩어진 생각이,', '하나의 구조가 되고,', '사람들이 쓰는 서비스로.']

export default function LandingHero() {
  const { enabled } = useMotion()
  const { hash } = useLocation()
  const [complete, setComplete] = useState(false)
  const [stage, setStage] = useState(0)
  const opening = enabled && !complete

  useEffect(() => {
    if (hash) setComplete(true)
  }, [hash])

  useEffect(() => {
    if (!opening) return
    const skipOnScroll = () => {
      if (window.scrollY > 80) setComplete(true)
    }
    // A slow or unavailable renderer must never hold up the introduction.
    const deadline = window.setTimeout(() => setComplete(true), 9000)
    window.addEventListener('scroll', skipOnScroll, { passive: true })
    return () => {
      window.clearTimeout(deadline)
      window.removeEventListener('scroll', skipOnScroll)
    }
  }, [opening])

  return (
    <section
      className={`hero container ${opening ? 'is-opening' : 'is-ready'}`}
      aria-labelledby="hero-title"
    >
      <HeroArt opening={opening} onStage={setStage} onComplete={() => setComplete(true)} />
      <div className="opening-copy" aria-hidden={!opening}>
        <span className="opening-label">CHOI JUN HO / FROM IDEA TO SERVICE</span>
        <p key={stage}>{openingCopy[stage]}</p>
        <div className="opening-stages" aria-label="인트로 진행 단계">
          {['IDEA', 'STRUCTURE', 'SERVICE'].map((label, index) => (
            <span key={label} className={stage >= index ? 'active' : ''}>
              <b>0{index + 1}</b>
              {label}
            </span>
          ))}
        </div>
        <button className="opening-skip" onClick={() => setComplete(true)}>
          건너뛰기
        </button>
      </div>
      <div className="hero-copy">
        <p className="hero-kicker">
          <span className="status-light" /> SOFTWARE DEVELOPER / CHOI JUN HO
        </p>
        <h1 id="hero-title">
          웹 개발자
          <br />
          <span>최준호</span>
        </h1>
        <p className="hero-description">
          웹사이트와 앱을 개발합니다.
          <br />
          대회 신청·결제, 투표 서비스, 뉴스 사이트 등을 만들었습니다.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/#work">
            포트폴리오
          </Link>
          <a
            className="button button-outline"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
