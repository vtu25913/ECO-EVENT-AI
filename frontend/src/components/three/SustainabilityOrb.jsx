import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getOrbColor } from '../../utils/sustainabilityEngine.js'

export default function SustainabilityOrb({ score = 50 }) {
  const orbRef = useRef()
  const particlesRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  const color = new THREE.Color(getOrbColor(score))

  const particleCount = 80
  const particles = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.5
      orbRef.current.rotation.x += delta * 0.2
      const targetColor = new THREE.Color(getOrbColor(score))
      orbRef.current.material.color.lerp(targetColor, 0.05)
      orbRef.current.material.emissive.lerp(targetColor, 0.05)
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.3
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.2
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.15

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group>
      {/* Main orb */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          shininess={60}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Environmental rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[2.5, 0.03, 16, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, Math.PI / 3, 0]}>
        <torusGeometry args={[2.8, 0.02, 16, 64]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.25} />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
