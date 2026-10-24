import type { createGalaxy } from './galaxy.ts'

export const GALAXY_FLOW = {
  spin: 0.055,
  assemblyTwist: 5,
  startScale: 1.65,
  wobbleSpeed: 0.4,
  wobblePhase: 40,
  wobble: 0.035,
  scatter: 0.55,
} as const

export function createGalaxyPointer() {
  return { x: 0, y: 0, active: false, pressed: false, epoch: 0, reset: 0, lastScrollAt: -1e10 }
}

export type GalaxyPointer = ReturnType<typeof createGalaxyPointer>
export type GalaxyRotation = { x: number; y: number; returning: boolean }
type Field = Pick<
  ReturnType<typeof createGalaxy>,
  'positions' | 'radii' | 'seeds' | 'background' | 'core'
>

export function createGalaxyMotion(count: number) {
  return {
    offsets: new Float32Array(count * 2),
    velocities: new Float32Array(count * 2),
    moving: new Set<number>(),
    pointerX: 0,
    pointerY: 0,
    pointerEpoch: -1,
    resetEpoch: 0,
    wasHovering: false,
  }
}

type Motion = ReturnType<typeof createGalaxyMotion>
type Frame = {
  delta: number
  time: number
  assembly: number
  progress: number
  width: number
  height: number
  matrix: ArrayLike<number>
  pointer: GalaxyPointer
  scrolling?: boolean
}

export function clearGalaxyMotion(motion: Motion) {
  const changed = motion.moving.size > 0
  motion.offsets.fill(0)
  motion.velocities.fill(0)
  motion.moving.clear()
  motion.wasHovering = false
  return changed
}

export function stepGalaxyMotion(motion: Motion, field: Field, frame: Frame) {
  const { pointer } = frame
  const width = Math.max(1, frame.width)
  const height = Math.max(1, frame.height)
  const halfWidth = width / 2
  const halfHeight = height / 2
  const delta = Math.max(0, Math.min(0.05, frame.delta))
  let changed = false
  if (pointer.reset !== motion.resetEpoch) {
    changed = clearGalaxyMotion(motion)
    motion.resetEpoch = pointer.reset
  }

  const drag = Math.exp(-2.6 * delta)
  const settle = Math.exp(-0.6 * delta)
  const travel = (settle - drag) / 2
  for (const i of motion.moving) {
    const index = i * 2
    const vx = motion.velocities[index]
    const vy = motion.velocities[index + 1]
    motion.offsets[index] = motion.offsets[index] * settle + vx * travel
    motion.offsets[index + 1] = motion.offsets[index + 1] * settle + vy * travel
    motion.velocities[index] = vx * drag
    motion.velocities[index + 1] = vy * drag
    const displacement = Math.hypot(
      motion.offsets[index] * halfWidth,
      motion.offsets[index + 1] * halfHeight,
    )
    const speed = Math.hypot(vx * halfWidth, vy * halfHeight)
    if (displacement < 0.1 && speed < 0.5) {
      motion.offsets[index] = motion.offsets[index + 1] = 0
      motion.velocities[index] = motion.velocities[index + 1] = 0
      motion.moving.delete(i)
    }
    changed = true
  }

  const hovering = pointer.active && !pointer.pressed && !frame.scrolling
  const continuous = hovering && motion.wasHovering && motion.pointerEpoch === pointer.epoch
  const previousX = motion.pointerX
  const previousY = motion.pointerY
  motion.pointerX = pointer.x
  motion.pointerY = pointer.y
  motion.pointerEpoch = pointer.epoch
  motion.wasHovering = hovering
  if (!continuous || delta === 0) return changed

  const dx = (pointer.x - previousX) * halfWidth
  const dy = (pointer.y - previousY) * halfHeight
  const distance = Math.hypot(dx, dy)
  if (distance < 0.05) return changed
  const influenceRadius = Math.min(100, Math.max(48, width * 0.13))
  const radiusSquared = influenceRadius * influenceRadius
  const startX = previousX * halfWidth
  const startY = previousY * halfHeight
  const impulse = Math.min(distance, 64) * 7
  const impulseX = (dx / distance) * impulse
  const impulseY = (dy / distance) * impulse
  const expansion = GALAXY_FLOW.startScale + (1 - GALAXY_FLOW.startScale) * frame.assembly
  const m = frame.matrix

  // Only project all particles on a real hover movement; idle frames visit the affected subset.
  for (let i = 0; i < field.seeds.length; i++) {
    if (field.background[i] || field.core[i]) continue
    const index = i * 3
    const x = field.positions[index]
    const y = field.positions[index + 1]
    const z = field.positions[index + 2]
    const radius = field.radii[i]
    const angle =
      (frame.time * GALAXY_FLOW.spin) / (0.4 + radius) +
      (1 - frame.assembly) * (1 - radius) * GALAXY_FLOW.assemblyTwist
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)
    const spread =
      (frame.progress * radius * GALAXY_FLOW.scatter) / Math.hypot(x + 0.001, y + 0.001, z + 0.001)
    const px = (cosine * x + sine * y) * expansion + (x + 0.001) * spread
    const py = (-sine * x + cosine * y) * expansion + (y + 0.001) * spread
    const pz =
      z * expansion +
      Math.sin(frame.time * GALAXY_FLOW.wobbleSpeed + field.seeds[i] * GALAXY_FLOW.wobblePhase) *
        GALAXY_FLOW.wobble +
      (z + 0.001) * spread
    const w = m[3] * px + m[7] * py + m[11] * pz + m[15]
    if (w <= 0.01) continue
    const offsetIndex = i * 2
    const screenX =
      ((m[0] * px + m[4] * py + m[8] * pz + m[12]) / w + motion.offsets[offsetIndex]) * halfWidth
    const screenY =
      ((m[1] * px + m[5] * py + m[9] * pz + m[13]) / w + motion.offsets[offsetIndex + 1]) *
      halfHeight
    const t = Math.max(
      0,
      Math.min(1, ((screenX - startX) * dx + (screenY - startY) * dy) / (distance * distance)),
    )
    const distanceSquared = (screenX - startX - dx * t) ** 2 + (screenY - startY - dy * t) ** 2
    if (distanceSquared >= radiusSquared) continue
    const weight = (1 - Math.sqrt(distanceSquared) / influenceRadius) ** 2
    const mass = 0.8 + field.seeds[i] * 0.8
    let vx = motion.velocities[offsetIndex] * halfWidth + (impulseX * weight) / mass
    let vy = motion.velocities[offsetIndex + 1] * halfHeight + (impulseY * weight) / mass
    const limit = Math.min(1, 850 / Math.max(1, Math.hypot(vx, vy)))
    vx *= limit
    vy *= limit
    motion.velocities[offsetIndex] = vx / halfWidth
    motion.velocities[offsetIndex + 1] = vy / halfHeight
    motion.moving.add(i)
    changed = true
  }
  return changed
}
