import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSphereProps {
  images: string[]
}

const PARTICLE_COUNT = 1500
const SPHERE_RADIUS = 9
const POSITION_RANDOMNESS = 4
const ROTATION_SPEED_Y = 0.0005
const IMAGE_SIZE = 1.5
const PARTICLE_SIZE = 0.06

export function ParticleSphere({ images }: ParticleSphereProps) {
  const groupRef = useRef<THREE.Group>(null)
  const textures = useTexture(images)

  // Single BufferGeometry for all particles — 1 draw call instead of 1500
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const r = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS
      positions[i * 3]     = r * Math.cos(theta) * Math.sin(phi)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi)
      const c = new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 0.8, 0.6 + Math.random() * 0.3)
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])

  const orbitingImages = useMemo(() => {
    const imgs = []
    const count = images.length
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = SPHERE_RADIUS * Math.cos(angle)
      const z = SPHERE_RADIUS * Math.sin(angle)
      const position = new THREE.Vector3(x, 0, z)
      const outward = position.clone().normalize()
      const matrix = new THREE.Matrix4()
      matrix.lookAt(position, position.clone().add(outward), new THREE.Vector3(0, 1, 0))
      const euler = new THREE.Euler().setFromRotationMatrix(matrix)
      imgs.push({
        position: [x, 0, z] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number],
        textureIndex: i % textures.length,
      })
    }
    return imgs
  }, [images.length, textures.length])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += ROTATION_SPEED_Y
  })

  return (
    <group ref={groupRef}>
      {/* All 1500 particles as a single Points object — 1 draw call */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={PARTICLE_SIZE} vertexColors sizeAttenuation transparent opacity={0.9} />
      </points>

      {/* Orbiting image planes — one mesh per image (10 draw calls max) */}
      {orbitingImages.map((img, i) => (
        <mesh key={`img-${i}`} position={img.position} rotation={img.rotation}>
          <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
          <meshBasicMaterial map={textures[img.textureIndex]} transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
