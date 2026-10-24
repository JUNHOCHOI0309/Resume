import type { GalaxyPointer } from './galaxyMotion.ts'

export function createStarfield(compact: boolean) {
  const count = compact ? 340 : 1200
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  let state = 3217
  const random = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  for (let i = 0; i < count; i++) {
    positions[i * 3] = random() * 2 - 1
    positions[i * 3 + 1] = random() * 2 - 1
    seeds[i] = random()
    sizes[i] = 0.12 + Math.pow(random(), 5) * 1.4
  }
  return {
    positions,
    seeds,
    sizes,
    radii: new Float32Array(count),
    background: new Float32Array(count),
    core: new Float32Array(count),
  }
}

export function trackStarPointer(
  pointer: GalaxyPointer,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return
  const active = x >= 0 && x <= width && y >= 0 && y <= height
  if (active !== pointer.active) pointer.epoch++
  pointer.active = active
  pointer.x = (x / width) * 2 - 1
  pointer.y = 1 - (y / height) * 2
}
