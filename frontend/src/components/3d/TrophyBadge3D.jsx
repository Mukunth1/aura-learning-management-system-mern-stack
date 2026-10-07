import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Cylinder, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';

function TrophyModel() {
  const trophyRef = useRef();

  useFrame((state) => {
    if (!trophyRef.current) return;
    const t = state.clock.getElapsedTime();
    trophyRef.current.rotation.y = t * 0.8;
  });

  return (
    <group ref={trophyRef} position={[0, -0.2, 0]} scale={1.2}>
      {/* Cup Base / Pedestal */}
      <Cylinder args={[0.7, 0.9, 0.4, 32]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </Cylinder>

      {/* Gold Trim Base */}
      <Cylinder args={[0.5, 0.6, 0.15, 32]} position={[0, -0.95, 0]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </Cylinder>

      {/* Trophy Stem */}
      <Cylinder args={[0.18, 0.25, 0.6, 32]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
      </Cylinder>

      {/* Cup Main Body (Gold) */}
      <Cone args={[0.9, 1.2, 32, 1, true]} position={[0, 0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial
          color="#facc15"
          metalness={0.95}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </Cone>

      {/* Left Handle */}
      <Torus args={[0.45, 0.08, 16, 32]} position={[-0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
      </Torus>

      {/* Right Handle */}
      <Torus args={[0.45, 0.08, 16, 32]} position={[0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.15} />
      </Torus>

      {/* Star / Crown inside Trophy */}
      <mesh position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fbbf24"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function TrophyBadge3D() {
  return (
    <div className="w-48 h-48 sm:w-56 sm:h-56 relative mx-auto">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={2.5} color="#fffbeb" />
          <pointLight position={[-4, 2, 2]} intensity={1.5} color="#fbbf24" />
          <pointLight position={[4, -2, 2]} intensity={1.2} color="#f59e0b" />

          <Sparkles count={30} scale={4} size={3} speed={0.6} color="#fde047" />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <TrophyModel />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
