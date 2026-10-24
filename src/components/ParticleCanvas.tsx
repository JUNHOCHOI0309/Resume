import { useEffect, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  DynamicDrawUsage,
  Matrix4,
  ShaderMaterial,
  type BufferAttribute,
  type Points,
} from 'three'
import { createGalaxy } from '../lib/galaxy'
import {
  GALAXY_FLOW,
  createGalaxyMotion,
  stepGalaxyMotion,
  type GalaxyPointer,
  type GalaxyRotation,
} from '../lib/galaxyMotion'

const vertexShader = `
  uniform float uTime;
  uniform float uAssembly;
  uniform float uProgress;
  uniform float uDpr;
  attribute vec2 aOffset;
  attribute float aSeed;
  attribute float aRadius;
  attribute float aSize;
  attribute float aBackground;
  attribute float aCore;
  varying float vSeed;
  varying float vAlpha;
  varying float vBackground;
  varying float vCore;
  varying float vMotion;
  void main() {
    vSeed = aSeed;
    vBackground = aBackground;
    vCore = aCore;
    vec3 p = position;
    if (aBackground < .5) {
      float angle = uTime * ${GALAXY_FLOW.spin} / (.4 + aRadius)
        + (1. - uAssembly) * (1. - aRadius) * ${GALAXY_FLOW.assemblyTwist.toFixed(1)};
      p.xy = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p.xy;
      p *= mix(${GALAXY_FLOW.startScale}, 1., uAssembly);
      p.z += sin(uTime * ${GALAXY_FLOW.wobbleSpeed} + aSeed * ${GALAXY_FLOW.wobblePhase.toFixed(1)}) * ${GALAXY_FLOW.wobble};
      p += normalize(position + .001) * uProgress * aRadius * ${GALAXY_FLOW.scatter};
      vAlpha = 1. - smoothstep(uAssembly * 1.4 - .35, uAssembly * 1.4 + .08, aRadius);
    } else {
      vAlpha = .35 + .35 * sin(uTime * .35 + aSeed * 50.);
    }
    vAlpha *= .78 + .22 * sin(uTime * (1. + aSeed) + aSeed * 60.);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    vMotion = smoothstep(.001, .14, length(aOffset));
    gl_PointSize = aCore > .5 ? 180. * uDpr * 8. / max(2., -mvPosition.z)
      : clamp(aSize * uDpr * 8. / max(2., -mvPosition.z), 1.5, 42.);
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.xy += aOffset * gl_Position.w;
  }
`

const fragmentShader = `
  varying float vSeed;
  varying float vAlpha;
  varying float vBackground;
  varying float vCore;
  varying float vMotion;
  void main() {
    vec2 uv = gl_PointCoord - .5;
    float radius = length(uv) * 2.;
    if (radius > 1.) discard;
    if (vCore > .5) {
      float glow = exp(-radius * radius * 28.) * .7 + exp(-radius * 6.) * .25;
      gl_FragColor = vec4(vec3(.78, .89, 1.) * 1.8, glow * vAlpha);
      return;
    }
    float halo = exp(-radius * 5.) * .5;
    float core = exp(-radius * radius * 32.) * 1.5;
    float rays = (exp(-abs(uv.x) * 95.) * exp(-abs(uv.y) * 16.)
      + exp(-abs(uv.y) * 95.) * exp(-abs(uv.x) * 16.))
      * smoothstep(.94, 1., vSeed) * .13;
    vec3 blue = mix(vec3(.28, .57, .88), vec3(.77, .91, 1.), vSeed);
    vec3 gold = mix(vec3(.87, .39, .16), vec3(1., .85, .63), vSeed);
    vec3 color = mix(blue, gold, step(.78, fract(vSeed * 17.)));
    color = mix(color, vec3(.91, .96, 1.), smoothstep(.92, 1., vSeed));
    float alpha = (core + halo + rays) * vAlpha;
    gl_FragColor = vec4(color * (1.35 - vBackground * .35 + vMotion * .35), alpha);
  }
`

type IntroProps = { opening: boolean; onStage: (stage: number) => void; onComplete: () => void }
type Rotation = RefObject<GalaxyRotation>
type Pointer = RefObject<GalaxyPointer>

function GalaxyField({
  progress,
  rotation,
  pointer,
  compact,
  opening,
  onStage,
  onComplete,
}: {
  progress: RefObject<number>
  rotation: Rotation
  pointer: Pointer
  compact: boolean
} & IntroProps) {
  const points = useRef<Points>(null)
  const offsets = useRef<BufferAttribute>(null)
  const elapsed = useRef(0)
  const lastStage = useRef(-1)
  const finished = useRef(false)
  const wasOpening = useRef(opening)
  const [field] = useState(() => createGalaxy(compact))
  const [motion] = useState(() => createGalaxyMotion(field.seeds.length))
  const [projection] = useState(() => new Matrix4())
  const scrollCooldown = useRef(0)
  const lastProgress = useRef(progress.current)
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
          uAssembly: { value: opening ? 0 : 1 },
          uProgress: { value: 0 },
          uDpr: { value: 1 },
        },
      }),
  )
  useEffect(() => () => material.dispose(), [material])
  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05)
    if (opening && !wasOpening.current) {
      elapsed.current = 0
      finished.current = false
      lastStage.current = -1
    }
    wasOpening.current = opening
    if (opening && !finished.current) {
      elapsed.current += step
      material.uniforms.uAssembly.value = Math.min(1, elapsed.current / 5.2)
      const stage = Math.min(2, Math.floor(elapsed.current / 2.2))
      if (stage !== lastStage.current) {
        lastStage.current = stage
        onStage(stage)
      }
      if (elapsed.current >= 7.2) {
        finished.current = true
        onComplete()
      }
    } else material.uniforms.uAssembly.value = 1
    material.uniforms.uTime.value += step
    material.uniforms.uDpr.value = state.gl.getPixelRatio()
    const damping = 1 - Math.exp(-delta * 5)
    material.uniforms.uProgress.value +=
      (progress.current - material.uniforms.uProgress.value) * damping
    if (points.current) {
      const rotationDamping = 1 - Math.exp(-step * (rotation.current.returning ? 5.5 : 14))
      points.current.rotation.x +=
        (0.48 + rotation.current.x - points.current.rotation.x) * rotationDamping
      points.current.rotation.y +=
        (-0.18 + rotation.current.y - points.current.rotation.y) * rotationDamping
      points.current.rotation.z = -0.3 + Math.sin(material.uniforms.uTime.value * 0.06) * 0.06
      points.current.updateWorldMatrix(true, false)
      projection.multiplyMatrices(state.camera.projectionMatrix, state.camera.matrixWorldInverse)
      projection.multiply(points.current.matrixWorld)
      scrollCooldown.current =
        Math.abs(progress.current - lastProgress.current) > 0.0001
          ? 0.15
          : Math.max(0, scrollCooldown.current - step)
      lastProgress.current = progress.current
      const changed = stepGalaxyMotion(motion, field, {
        delta: step,
        time: material.uniforms.uTime.value,
        assembly: material.uniforms.uAssembly.value,
        progress: material.uniforms.uProgress.value,
        width: state.size.width,
        height: state.size.height,
        matrix: projection.elements,
        pointer: pointer.current,
        scrolling:
          scrollCooldown.current > 0 || performance.now() - pointer.current.lastScrollAt < 150,
      })
      if (changed && offsets.current) offsets.current.needsUpdate = true
    }
  })
  return (
    <points ref={points} material={material} rotation={[0.48, -0.18, -0.3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[field.seeds, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[field.radii, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[field.sizes, 1]} />
        <bufferAttribute attach="attributes-aBackground" args={[field.background, 1]} />
        <bufferAttribute attach="attributes-aCore" args={[field.core, 1]} />
        <bufferAttribute
          ref={offsets}
          attach="attributes-aOffset"
          args={[motion.offsets, 2]}
          usage={DynamicDrawUsage}
        />
      </bufferGeometry>
    </points>
  )
}

export default function ParticleCanvas({
  visible,
  progress,
  rotation,
  pointer,
  onFailure,
  opening,
  onStage,
  onComplete,
}: {
  visible: boolean
  progress: RefObject<number>
  rotation: Rotation
  pointer: Pointer
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
      camera={{ position: [0, 0, 8.2], fov: 46 }}
      dpr={[1, compact ? 1.25 : 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      frameloop={visible && pageVisible ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })
      }}
      fallback={<div />}
    >
      <GalaxyField
        progress={progress}
        rotation={rotation}
        pointer={pointer}
        compact={compact}
        opening={opening}
        onStage={onStage}
        onComplete={onComplete}
      />
    </Canvas>
  )
}
