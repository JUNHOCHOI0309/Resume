import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../data/content'
import { GALAXY_INTRO, type HeroPhase } from '../lib/galaxyIntro'
import { useMotion } from '../lib/motion'
import HeroArt from './HeroArt'

const openingCopy = ['흩어진 생각이,', '하나의 구조가 되고,', '사람들이 쓰는 서비스로.']

export default function LandingHero() {
  const { enabled } = useMotion()
  const { hash } = useLocation()
  const [phase, setPhase] = useState<HeroPhase>('opening')
  const [stage, setStage] = useState(0)
  const currentPhase = enabled ? phase : 'ready'
  const opening = currentPhase === 'opening' || currentPhase === 'scattering'
  const playing = currentPhase !== 'ready'

  useEffect(() => {
    if (hash || !enabled) setPhase('ready')
  }, [hash, enabled])

  useEffect(() => {
    if (!playing) return
    const skipOnScroll = () => {
      if (window.scrollY > 80) setPhase('ready')
    }
    // A slow or unavailable renderer must never hold up the introduction.
    const deadline = window.setTimeout(() => setPhase('ready'), GALAXY_INTRO.deadline)
    window.addEventListener('scroll', skipOnScroll, { passive: true })
    return () => {
      window.clearTimeout(deadline)
      window.removeEventListener('scroll', skipOnScroll)
    }
  }, [playing])

  return (
    <section
      className={`hero container ${opening ? 'is-opening' : 'is-ready'}`}
      data-intro-phase={currentPhase}
      aria-labelledby="hero-title"
    >
      <HeroArt phase={currentPhase} onStage={setStage} onPhase={setPhase} />
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
        <button className="opening-skip" onClick={() => setPhase('ready')}>
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
          항상 새로운 것을 추구하고, 발전해 나가는 개발자입니다.
          <br />
          주로 웹사이트와 앱을 개발해 나갑니다.
          <br />
          아이디어를 실제로 사용할 수 있는 서비스로 만드는 데 관심이 있습니다.
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
