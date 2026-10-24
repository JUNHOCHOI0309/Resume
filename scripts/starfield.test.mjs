import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { createStarfield, trackStarPointer } from '../src/lib/starfield.ts'
import {
  createGalaxyPointer,
  createGalaxyMotion,
  stepGalaxyMotion,
} from '../src/lib/galaxyMotion.ts'

test('global starfields are deterministic, finite and fit the normalized viewport', () => {
  for (const compact of [true, false]) {
    const field = createStarfield(compact)
    assert.equal(field.seeds.length, compact ? 340 : 1200)
    assert.deepEqual(field, createStarfield(compact))
    for (const buffer of Object.values(field)) assert.ok(buffer.every(Number.isFinite))
    for (let i = 0; i < field.seeds.length; i++) {
      assert.ok(Math.abs(field.positions[i * 3]) <= 1)
      assert.ok(Math.abs(field.positions[i * 3 + 1]) <= 1)
      assert.ok(field.sizes[i] > 0)
      assert.equal(field.background[i], 0)
      assert.equal(field.core[i], 0)
    }
  }
})

test('pointer coordinates map viewport corners and center without document scroll offsets', () => {
  const pointer = createGalaxyPointer()
  trackStarPointer(pointer, 0, 0, 1440, 900)
  assert.equal(pointer.x, -1)
  assert.equal(pointer.y, 1)
  trackStarPointer(pointer, 720, 450, 1440, 900)
  assert.equal(pointer.x, 0)
  assert.equal(pointer.y, 0)
  trackStarPointer(pointer, 1440, 900, 1440, 900)
  assert.equal(pointer.x, 1)
  assert.equal(pointer.y, -1)
})

test('leaving the viewport and re-entering creates a new pointer epoch', () => {
  const pointer = createGalaxyPointer()
  trackStarPointer(pointer, 200, 200, 1000, 800)
  const entered = pointer.epoch
  trackStarPointer(pointer, -20, 200, 1000, 800)
  assert.equal(pointer.active, false)
  assert.ok(pointer.epoch > entered)
  const left = pointer.epoch
  trackStarPointer(pointer, 900, 200, 1000, 800)
  assert.equal(pointer.active, true)
  assert.ok(pointer.epoch > left)
})

test('invalid input never poisons pointer coordinates', () => {
  const pointer = createGalaxyPointer()
  trackStarPointer(pointer, 200, 200, 1000, 800)
  const previous = { ...pointer }
  trackStarPointer(pointer, NaN, 200, 1000, 800)
  trackStarPointer(pointer, 200, 200, 0, 800)
  assert.deepEqual(pointer, previous)
})

test('global stars reuse individual momentum rather than a stationary cursor hole', () => {
  const field = createStarfield(true)
  const pointer = createGalaxyPointer()
  const motion = createGalaxyMotion(field.seeds.length)
  const frame = {
    delta: 1 / 60,
    time: 0,
    assembly: 1,
    progress: 0,
    width: 1000,
    height: 800,
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    pointer,
  }
  trackStarPointer(pointer, 100, 400, 1000, 800)
  for (let i = 0; i < 30; i++) stepGalaxyMotion(motion, field, frame)
  assert.equal(motion.moving.size, 0)
  trackStarPointer(pointer, 900, 400, 1000, 800)
  stepGalaxyMotion(motion, field, frame)
  assert.ok(motion.moving.size > 0)
  stepGalaxyMotion(motion, field, frame)
  assert.ok(motion.offsets.some((value) => value > 0))
  assert.ok(motion.offsets.every(Number.isFinite))
})
