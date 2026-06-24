import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AIHologram({ isTalking = false }) {
  const orbRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    if (orbRef.current) {
      orbRef.current.rotation.x += delta * 0.2
      orbRef.current.rotation.y += delta * 0.3
      const scale = 1 + (isTalking ? Math.sin(time * 4) * 0.05 : Math.sin(time * 1.5) * 0.03)
      orbRef.current.scale.setScalar(scale)
      orbRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5
      ring1Ref.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.05)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.3
      ring2Ref.current.scale.setScalar(1 + Math.sin(time * 1.2 + 1) * 0.05)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.2
      ring3Ref.current.scale.setScalar(1 + Math.sin(time + 2) * 0.05)
    }
  })

  return (
    <group>
      {/* Core orb */}
      <mesh ref={orbRef}>
        <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />
        <meshPhongMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Holographic rings */}
      <mesh ref={ring1Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.0, 0.02, 16, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.3, 0.02, 16, 48]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, Math.PI / 3, 0]}>
        <torusGeometry args={[1.6, 0.015, 16, 48]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.25} />
      </mesh>

      {/* Floating particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={40}
            array={new Float32Array(Array.from({ length: 120 }, () => (Math.random() - 0.5) * 3))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#22d3ee" transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  )
}
