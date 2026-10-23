import { useEffect, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, ShaderMaterial, Vector2, type Points } from 'three'

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uMorph;
  uniform vec2 uPointer;
  attribute float aSeed;
  attribute vec3 aCloud;
  attribute vec3 aSphere;
  attribute vec3 aPlane;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vSeed = aSeed;
    vec3 p;
    if (uMorph < 1.) p = mix(aCloud, aSphere, smoothstep(0., 1., uMorph));
    else if (uMorph < 2.) p = mix(aSphere, aPlane, smoothstep(1., 2., uMorph));
    else p = mix(aPlane, position, smoothstep(2., 3., uMorph));
    p += normalize(p) * sin(uTime * .65 + aSeed * 30.) * .045;
    p += vec3(sin(aSeed*35.), cos(aSeed*52.), sin(aSeed*71.)) * uProgress * 1.7;
    vec2 difference = p.xy - uPointer * 2.6;
    float repel = exp(-dot(difference, difference) * 2.5);
    p.xy += normalize(difference + .001) * repel * .28;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    vDepth = clamp((-mvPosition.z - 3.) / 7., 0., 1.);
    gl_PointSize = clamp((14. + aSeed * 24.) / -mvPosition.z, 1., 7.);
    gl_Position = projectionMatrix * mvPosition;
  }
`
const fragmentShader = `
  varying float vSeed;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - .5) * 2.;
    if (d > 1.) discard;
    float halo = pow(1. - d, 2.);
    vec3 violet = mix(vec3(.38,.18,.88), vec3(.82,.65,1.), vSeed);
    vec3 color = mix(violet, vec3(.97,.93,1.), pow(vSeed, 5.));
    gl_FragColor = vec4(color * 1.45, halo * (1. - vDepth * .35));
  }
`

type IntroProps = { opening: boolean; onStage: (stage: number) => void; onComplete: () => void }

function ParticleField({
  progress,
  compact,
  opening,
  onStage,
  onComplete,
}: { progress: RefObject<number>; compact: boolean } & IntroProps) {
  const points = useRef<Points>(null)
  const elapsed = useRef(0)
  const lastStage = useRef(-1)
  const finished = useRef(false)
  const [field] = useState(() => {
    const count = compact ? 1600 : 6000
    const positions = new Float32Array(count * 3)
    const cloud = new Float32Array(count * 3)
    const sphere = new Float32Array(count * 3)
    const plane = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    let seed = 8701
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = 0; i < count; i++) {
      const t = random() * Math.PI * 2
      const edge = random() * Math.PI * 2
      const width = 0.08 + random() * 0.23
      // A braided orbital knot: each point follows the same curve with a small radial offset.
      positions[i * 3] = (2 + Math.cos(3 * t)) * Math.cos(2 * t) * 0.67 + Math.cos(edge) * width
      positions[i * 3 + 1] = (2 + Math.cos(3 * t)) * Math.sin(2 * t) * 0.67 + Math.sin(edge) * width
      positions[i * 3 + 2] = Math.sin(3 * t) * 0.72 + (random() - 0.5) * width
      const latitude = Math.acos(1 - (2 * (i + 0.5)) / count)
      const longitude = i * 2.399963
      sphere[i * 3] = Math.sin(latitude) * Math.cos(longitude) * 1.85
      sphere[i * 3 + 1] = Math.cos(latitude) * 1.85
      sphere[i * 3 + 2] = Math.sin(latitude) * Math.sin(longitude) * 1.85
      const radius = Math.cbrt(random()) * 3.1
      cloud[i * 3] = Math.sin(latitude) * Math.cos(t) * radius
      cloud[i * 3 + 1] = Math.cos(latitude) * radius
      cloud[i * 3 + 2] = Math.sin(latitude) * Math.sin(t) * radius
      const columns = Math.ceil(Math.sqrt(count))
      const x = ((i % columns) / columns - 0.5) * 4.8
      const y = (Math.floor(i / columns) / columns - 0.5) * 3.3
      plane[i * 3] = x
      plane[i * 3 + 1] = y
      plane[i * 3 + 2] = Math.sin(x * 1.7) * Math.cos(y * 1.7) * 0.75
      seeds[i] = random()
    }
    return { positions, seeds, cloud, sphere, plane }
  })
  const [material] = useState(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uMorph: { value: 0 },
          uPointer: { value: new Vector2(10, 10) },
        },
      }),
  )
  useEffect(() => () => material.dispose(), [material])
  useFrame((state, delta) => {
    if (opening && !finished.current) {
      elapsed.current += Math.min(delta, 0.05)
      material.uniforms.uMorph.value = Math.min(3, elapsed.current / 1.65)
      const stage = Math.min(2, Math.floor(elapsed.current / 1.65))
      if (stage !== lastStage.current) {
        lastStage.current = stage
        onStage(stage)
      }
      if (elapsed.current >= 5.6) {
        finished.current = true
        onComplete()
      }
    } else material.uniforms.uMorph.value = 3
    material.uniforms.uTime.value += Math.min(delta, 0.05)
    material.uniforms.uProgress.value +=
      (progress.current - material.uniforms.uProgress.value) * 0.05
    material.uniforms.uPointer.value.lerp(state.pointer, 0.045)
    if (points.current) {
      points.current.rotation.y += Math.min(delta, 0.05) * 0.065
      points.current.rotation.x = 0.38 + Math.sin(material.uniforms.uTime.value * 0.12) * 0.08
    }
  })
  return (
    <points ref={points} material={material} rotation={[0.38, 0, -0.32]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
        <bufferAttribute attach="attributes-aCloud" args={[field.cloud, 3]} />
        <bufferAttribute attach="attributes-aSphere" args={[field.sphere, 3]} />
        <bufferAttribute attach="attributes-aPlane" args={[field.plane, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[field.seeds, 1]} />
      </bufferGeometry>
    </points>
  )
}

export default function ParticleCanvas({
  visible,
  progress,
  onFailure,
  opening,
  onStage,
  onComplete,
}: {
  visible: boolean
  progress: RefObject<number>
  onFailure: () => void
} & IntroProps) {
  const [compact] = useState(() => window.innerWidth < 768 || navigator.hardwareConcurrency <= 4)
  const [pageVisible, setPageVisible] = useState(true)
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 48 }}
      dpr={[1, compact ? 1.25 : 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      frameloop={visible && pageVisible ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })
      }}
      fallback={<div />}
    >
      <ParticleField
        progress={progress}
        compact={compact}
        opening={opening}
        onStage={onStage}
        onComplete={onComplete}
      />
    </Canvas>
  )
}
