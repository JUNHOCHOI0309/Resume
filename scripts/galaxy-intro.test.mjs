import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { createGalaxy } from '../src/lib/galaxy.ts'
import {
  GALAXY_BURST,
  GALAXY_INTRO,
  advanceGalaxyIntro,
  getGalaxyIntroFrame,
} from '../src/lib/galaxyIntro.ts'

test('intro timing is independent of the physics step cap at low frame rates', () => {
  for (const fps of [1, 4, 10, 15, 30, 60, 120]) {
    let elapsed = 0
    for (let i = 0; i < fps * 11; i++) elapsed = advanceGalaxyIntro(elapsed, 1 / fps)
    assert.equal(getGalaxyIntroFrame(elapsed).phase, 'ready')
  }
  assert.equal(advanceGalaxyIntro(2, 30, true), 2)
  assert.equal(advanceGalaxyIntro(2, 30), GALAXY_INTRO.finishAt)
  assert.equal(advanceGalaxyIntro(2, NaN), 2)
})

test('the service copy is held before any scattering starts', () => {
  const serviceAt = GALAXY_INTRO.stageDuration * 2
  assert.equal(getGalaxyIntroFrame(serviceAt).stage, 2)
  assert.ok(GALAXY_INTRO.scatterAt - serviceAt >= 2)
  assert.equal(getGalaxyIntroFrame(GALAXY_INTRO.scatterAt - 0.01).burst, 0)
})

test('the galaxy scatters before the main layout appears', () => {
  const middle = getGalaxyIntroFrame((GALAXY_INTRO.scatterAt + GALAXY_INTRO.revealAt) / 2)
  assert.equal(middle.phase, 'scattering')
  assert.ok(middle.burst > 0.5 && middle.burst < 1)
  assert.equal(middle.gather, 0)
  const revealed = getGalaxyIntroFrame(GALAXY_INTRO.revealAt)
  assert.equal(revealed.phase, 'gathering')
  assert.equal(revealed.burst, 1)
  assert.equal(revealed.gather, 0)
})

test('arrival waits for the layout handoff and then gathers to an exact resting pose', () => {
  assert.ok(GALAXY_INTRO.gatherAt - GALAXY_INTRO.revealAt >= 0.5)
  const middle = getGalaxyIntroFrame((GALAXY_INTRO.gatherAt + GALAXY_INTRO.finishAt) / 2)
  assert.equal(middle.phase, 'gathering')
  assert.ok(middle.gather > 0 && middle.gather < 1)
  const resting = getGalaxyIntroFrame(GALAXY_INTRO.finishAt)
  assert.equal(resting.phase, 'ready')
  assert.equal(resting.burst, 0)
  assert.equal(resting.gather, 1)
  assert.equal(resting.assembly, 1)
  assert.ok(GALAXY_BURST.stagger + GALAXY_BURST.travel <= 1)
})

test('timeline samples stay finite and bounded, including invalid input', () => {
  for (const time of [-1, NaN, Infinity, ...Array.from({ length: 800 }, (_, i) => i / 60)]) {
    const sample = getGalaxyIntroFrame(time)
    for (const key of ['assembly', 'burst', 'gather']) {
      assert.ok(Number.isFinite(sample[key]))
      assert.ok(sample[key] >= 0 && sample[key] <= 1)
    }
    assert.ok(sample.stage >= 0 && sample.stage <= 2)
  }
})

test('exit paths are deterministic, distinct and do not move ambient stars or the core glow', () => {
  for (const compact of [true, false]) {
    const field = createGalaxy(compact)
    assert.equal(field.scatter.length, field.positions.length)
    assert.deepEqual(field.scatter, createGalaxy(compact).scatter)
    assert.ok(field.scatter.every(Number.isFinite))
    for (let i = 0; i < field.seeds.length; i++) {
      const path = field.scatter.subarray(i * 3, i * 3 + 3)
      if (field.background[i] || field.core[i]) assert.ok(path.every((value) => value === 0))
      else {
        assert.ok(Math.hypot(path[0], path[1]) > 3.5)
        assert.ok(path[2] < 0)
      }
    }
  }
})
