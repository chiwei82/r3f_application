import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import vertexShader from './cross.vert.glsl'
import fragmentShader from './cross.frag.glsl'
import { useRef } from 'react'

// uTime uniform
const CrossShaderMaterial = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
)
CrossShaderMaterial.transparent = true
extend({ CrossShaderMaterial })

// React hook
export function AnimatedCrossMaterial() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime()
    }
  })

  return <crossShaderMaterial ref={ref} />
}
