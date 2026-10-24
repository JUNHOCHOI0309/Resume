export type HeroPhase = 'opening' | 'scattering' | 'gathering' | 'ready'

export const GALAXY_INTRO = {
  stageDuration: 2.2,
  assemblyDuration: 5.2,
  scatterAt: 6.6,
  revealAt: 7.65,
  gatherAt: 8.3,
  finishAt: 10.5,
  deadline: 15000,
} as const

export const GALAXY_BURST = { stagger: 0.3, travel: 0.7 } as const

const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function advanceGalaxyIntro(elapsed: number, delta: number, resuming = false) {
  const step = !resuming && Number.isFinite(delta) ? Math.max(0, delta) : 0
  return Math.min(GALAXY_INTRO.finishAt, elapsed + step)
}

export function getGalaxyIntroFrame(elapsed: number) {
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0
  const phase: HeroPhase =
    time >= GALAXY_INTRO.finishAt
      ? 'ready'
      : time >= GALAXY_INTRO.revealAt
        ? 'gathering'
        : time >= GALAXY_INTRO.scatterAt
          ? 'scattering'
          : 'opening'
  const scatter = clamp(
    (time - GALAXY_INTRO.scatterAt) / (GALAXY_INTRO.revealAt - GALAXY_INTRO.scatterAt),
  )
  return {
    phase,
    stage: Math.min(2, Math.floor(time / GALAXY_INTRO.stageDuration)),
    assembly: clamp(time / GALAXY_INTRO.assemblyDuration),
    burst: phase === 'ready' ? 0 : 1 - (1 - scatter) ** 3,
    gather: clamp((time - GALAXY_INTRO.gatherAt) / (GALAXY_INTRO.finishAt - GALAXY_INTRO.gatherAt)),
  }
}
