import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Tree({ position, scale = 1, healthy = true }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1, 6]} />
        <meshPhongMaterial color={healthy ? '#5D4037' : '#795548'} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 1.2 + Math.random() * 0.3, 0]}>
        <sphereGeometry args={[0.35 + Math.random() * 0.2, 6, 6]} />
        <meshPhongMaterial
          color={healthy ? `hsl(${120 + Math.random() * 20}, 70%, ${35 + Math.random() * 20}%)` : '#8B7355'}
          flatShading
        />
      </mesh>
    </group>
  )
}

function Flower({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshPhongMaterial color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
    </mesh>
  )
}

export default function Ecosystem({ score = 50 }) {
  const groundRef = useRef()
  const birdRefs = useRef([])

  const isHealthy = score >= 60
  const treeCount = isHealthy ? 12 : 5
  const flowerCount = isHealthy ? 20 : 3

  const trees = useMemo(() => {
    const arr = []
    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 3
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        scale: 0.8 + Math.random() * 0.6,
      })
    }
    return arr
  }, [treeCount])

  const flowers = useMemo(() => {
    const arr = []
    for (let i = 0; i < flowerCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * 3
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
      })
    }
    return arr
  }, [flowerCount])

  const birds = useMemo(() => {
    if (!isHealthy) return []
    return Array.from({ length: 3 }, (_, i) => ({
      offset: (i * Math.PI * 2) / 3,
      radius: 3 + Math.random() * 2,
      height: 3 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.3,
    }))
  }, [isHealthy])

  useFrame((state, delta) => {
    if (groundRef.current) {
      const targetColor = new THREE.Color(isHealthy ? '#2d5a27' : '#5a4a3a')
      groundRef.current.material.color.lerp(targetColor, 0.02)
    }
  })

  return (
    <group>
      {/* Ground */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshPhongMaterial
          color={isHealthy ? '#2d5a27' : '#5a4a3a'}
          flatShading
        />
      </mesh>

      {/* Trees */}
      {trees.map((tree, i) => (
        <Tree key={i} position={tree.position} scale={tree.scale} healthy={isHealthy} />
      ))}

      {/* Flowers */}
      {flowers.map((flower, i) => (
        <Flower key={i} position={flower.position} />
      ))}

      {/* Pollution particles (low score) */}
      {!isHealthy && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={30}
              array={new Float32Array(Array.from({ length: 90 }, () => (Math.random() - 0.5) * 6))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.08} color="#666666" transparent opacity={0.5} sizeAttenuation />
        </points>
      )}

      {/* Birds (high score) */}
      {isHealthy && birds.map((bird, i) => {
        const birdRef = useRef()
        if (i === 0) birdRefs.current[i] = birdRef
        return (
          <mesh
            key={i}
            ref={birdRef}
            position={[
              Math.cos(bird.offset) * bird.radius,
              bird.height,
              Math.sin(bird.offset) * bird.radius,
            ]}
          >
            <coneGeometry args={[0.05, 0.15, 3]} />
            <meshPhongMaterial color="#444" />
          </mesh>
        )
      })}
    </group>
  )
}
