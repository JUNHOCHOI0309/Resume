import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { createGalaxy } from '../src/lib/galaxy.ts'
import {
  createGalaxyMotion,
  createGalaxyPointer,
  stepGalaxyMotion,
} from '../src/lib/galaxyMotion.ts'

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

function setup() {
  const field = {
    positions: new Float32Array(9),
    radii: new Float32Array(3),
    seeds: new Float32Array([0, 1, 0.5]),
    background: new Float32Array([0, 0, 1]),
    core: new Float32Array(3),
  }
  const motion = createGalaxyMotion(3)
  const pointer = createGalaxyPointer()
  Object.assign(pointer, { active: true, x: -0.6, epoch: 1 })
  const frame = {
    delta: 1 / 60,
    time: 0,
    assembly: 1,
    progress: 0,
    width: 1000,
    height: 800,
    matrix: identity,
    pointer,
  }
  const tick = (overrides = {}) => stepGalaxyMotion(motion, field, { ...frame, ...overrides })
  const sweep = () => {
    tick()
    pointer.x = 0.6
    tick()
  }
  return { field, motion, pointer, frame, tick, sweep }
}

test('entering or holding a stationary pointer does not create a fixed hole', () => {
  const { motion, tick } = setup()
  for (let i = 0; i < 90; i++) tick()
  assert.equal(motion.moving.size, 0)
  assert.ok(motion.offsets.every((value) => value === 0))
})

test('a fast sweep affects stars along the full path, not only the endpoint', () => {
  const { motion, sweep } = setup()
  sweep()
  assert.ok(motion.velocities[0] > 0)
  assert.equal(motion.velocities[1], 0)
  assert.ok(motion.moving.has(0))
})

test('individual mass changes momentum and background stars stay untouched', () => {
  const { motion, sweep } = setup()
  sweep()
  assert.ok(motion.velocities[0] > motion.velocities[2])
  assert.equal(motion.velocities[4], 0)
  assert.equal(motion.moving.has(2), false)
})

test('stars coast after the pointer stops, then settle without a positional snap', () => {
  const { motion, sweep, tick, pointer } = setup()
  sweep()
  const initialVelocity = motion.velocities[0]
  pointer.active = false
  tick()
  assert.ok(motion.offsets[0] > 0)
  assert.ok(motion.velocities[0] < initialVelocity)
  for (let i = 0; i < 1800; i++) tick()
  assert.equal(motion.moving.size, 0)
  assert.ok(motion.offsets.every((value) => value === 0))
})

test('pressed dragging does not also inject hover impulses', () => {
  const { motion, pointer, tick } = setup()
  tick()
  pointer.pressed = true
  pointer.x = 0.6
  tick()
  assert.equal(motion.moving.size, 0)
})

test('leaving and re-entering does not draw a phantom sweep across the galaxy', () => {
  const { motion, pointer, tick } = setup()
  tick()
  pointer.active = false
  pointer.epoch++
  tick()
  pointer.active = true
  pointer.x = 0.6
  pointer.epoch++
  tick()
  assert.equal(motion.moving.size, 0)
})

test('a reset on resize, blur or tab hiding clears stale momentum', () => {
  const { motion, pointer, sweep, tick } = setup()
  sweep()
  tick()
  pointer.reset++
  tick({ width: 390, height: 844 })
  assert.equal(motion.moving.size, 0)
  assert.ok(motion.offsets.every((value) => value === 0))
  assert.ok(motion.velocities.every((value) => value === 0))
})

test('scrolling suppresses hover impulses and seeds a fresh pointer on resume', () => {
  const { motion, pointer, tick } = setup()
  tick()
  pointer.x = 0.6
  tick({ scrolling: true })
  tick({ scrolling: false })
  assert.equal(motion.moving.size, 0)
})

test('coasting remains consistent at 30 and 60 frames per second', () => {
  const a = setup(),
    b = setup()
  a.sweep()
  b.sweep()
  a.pointer.active = b.pointer.active = false
  for (let i = 0; i < 30; i++) a.tick({ delta: 1 / 30 })
  for (let i = 0; i < 60; i++) b.tick({ delta: 1 / 60 })
  assert.ok(Math.abs(a.motion.offsets[0] - b.motion.offsets[0]) < 0.00001)
})

test('projection follows the current object transform after rotation or layout changes', () => {
  const { field, motion, pointer, tick } = setup()
  field.positions[0] = 3
  field.core[1] = 1
  tick()
  pointer.x = 0.6
  tick()
  assert.equal(motion.moving.size, 0)
  pointer.epoch++
  pointer.x = -0.6
  const translated = [...identity]
  translated[12] = -3
  tick({ matrix: translated })
  pointer.x = 0.6
  tick({ matrix: translated })
  assert.ok(motion.moving.has(0))
  assert.equal(motion.moving.has(1), false)
})

test('real galaxy buffers remain finite through repeated fast movements', () => {
  const field = createGalaxy(true)
  const motion = createGalaxyMotion(field.seeds.length)
  const pointer = createGalaxyPointer()
  pointer.active = true
  const projection = [...identity]
  projection[0] = projection[5] = 0.25
  for (let i = 0; i < 80; i++) {
    pointer.x = Math.sin(i * 0.4) * 0.8
    pointer.y = Math.cos(i * 0.4) * 0.5
    stepGalaxyMotion(motion, field, {
      delta: 1 / 60,
      time: i / 60,
      assembly: 1,
      progress: 0,
      width: 1200,
      height: 800,
      matrix: projection,
      pointer,
    })
  }
  assert.ok(motion.moving.size > 0)
  assert.ok(motion.offsets.every(Number.isFinite))
  assert.ok(motion.velocities.every(Number.isFinite))
})
