import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Earth({ sustainabilityScore = 50 }) {
  const earthRef = useRef()
  const cloudRef = useRef()
  const glowRef = useRef()

  const greenIntensity = Math.min(sustainabilityScore / 100, 1)
  const glowColor = new THREE.Color().setHSL(0.33 * greenIntensity, 0.8, 0.5)

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.08
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + greenIntensity * 0.4
      glowRef.current.material.color.setHSL(0.33 * greenIntensity, 0.9, 0.5 + greenIntensity * 0.2)
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#1a6b3c"
          emissive={new THREE.Color().setHSL(0.33 * greenIntensity, 0.6, 0.1)}
          emissiveIntensity={0.2 + greenIntensity * 0.4}
          shininess={25}
          specular={new THREE.Color(0x222222)}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere ref={glowRef} args={[2.15, 48, 48]}>
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3 + greenIntensity * 0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudRef} args={[2.08, 32, 32]}>
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>

      {/* Decorative rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 3 + i * 0.5, 0, 0]}>
          <ringGeometry args={[2.4 + i * 0.3, 2.5 + i * 0.3, 64]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.08 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
