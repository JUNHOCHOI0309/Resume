export function createGalaxy(compact: boolean) {
  const count = compact ? 4800 : 16000
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const radii = new Float32Array(count)
  const sizes = new Float32Array(count)
  const background = new Float32Array(count)
  const core = new Float32Array(count)
  const scatter = new Float32Array(count * 3)
  let seed = 8701
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const gaussian = () =>
    Math.sqrt(-2 * Math.log(Math.max(0.0001, random()))) * Math.cos(random() * Math.PI * 2)

  for (let i = 0; i < count; i++) {
    const isBackground = i % 15 === 0
    const isCore = !isBackground && i % 5 === 0
    const radius = isCore ? Math.pow(random(), 1.5) * 0.48 : 0.16 + Math.pow(random(), 0.7) * 2.85
    const normalized = radius / 3.01
    // Four spiral arms share a compact luminous nucleus.
    const angle =
      ((i % 4) * Math.PI) / 2 +
      Math.pow(normalized, 0.65) * 8.5 +
      gaussian() * (isCore ? 2 : 0.085 + (1 - normalized) * 0.11)
    const spread = gaussian() * (0.025 + normalized * 0.065)
    positions[i * 3] = isBackground ? (random() - 0.5) * 17 : Math.cos(angle) * (radius + spread)
    positions[i * 3 + 1] = isBackground
      ? (random() - 0.5) * 12
      : Math.sin(angle) * (radius + spread)
    positions[i * 3 + 2] = isBackground
      ? -2 - random() * 5
      : gaussian() * (0.035 + (1 - normalized) * 0.1)
    seeds[i] = random()
    radii[i] = normalized
    sizes[i] = isBackground ? 0.7 + random() * 2 : 0.85 + Math.pow(random(), 8) * 19
    background[i] = isBackground ? 1 : 0
  }
  // Keep the original galaxy distribution stable while giving each star its own exit path.
  for (let i = 0; i < count - 1; i++) {
    if (background[i]) continue
    const angle = Math.atan2(positions[i * 3 + 1], positions[i * 3]) + (random() - 0.5) * 0.8
    const distance = 4.5 + Math.sqrt(random()) * 7
    scatter[i * 3] = Math.cos(angle) * distance
    scatter[i * 3 + 1] = Math.sin(angle) * distance * 0.8
    scatter[i * 3 + 2] = -1 - random() * 3.5
  }
  // A single soft sprite supplies the core bloom without a full-screen postprocessing pass.
  positions.set([0, 0, 0], (count - 1) * 3)
  radii[count - 1] = 0
  background[count - 1] = 0
  core[count - 1] = 1
  return { positions, seeds, radii, sizes, background, core, scatter }
}
