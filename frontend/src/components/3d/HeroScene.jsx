import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Interactive Floating 3D Book
function FloatingBook({ position, rotation, color = '#6366f1', scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.15;
    meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.2;
    meshRef.current.rotation.z = rotation[2] + Math.cos(t * 1.2) * 0.1;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Book Cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.1, 0.32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Book Pages */}
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[1.4, 1.96, 0.26]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      {/* Golden Bookmark / Ribbon */}
      <mesh position={[-0.76, 0, 0]}>
        <boxGeometry args={[0.05, 1.6, 0.04]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Glowing Core Holographic Knot
function HolographicCore({ mousePos }) {
  const coreRef = useRef();

  useFrame((state) => {
    if (!coreRef.current) return;
    const t = state.clock.getElapsedTime();
    coreRef.current.rotation.x = t * 0.3 + mousePos.y * 0.5;
    coreRef.current.rotation.y = t * 0.4 + mousePos.x * 0.5;
  });

  return (
    <group ref={coreRef} position={[0, 0, -0.5]}>
      {/* Outer Torus Orbit */}
      <Torus args={[2.2, 0.08, 24, 64]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </Torus>

      {/* Cross Orbit */}
      <Torus args={[1.8, 0.06, 24, 64]} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7e22ce"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </Torus>

      {/* Central Distorted Glowing Sphere */}
      <Sphere args={[0.85, 48, 48]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </group>
  );
}

// Full 3D Canvas Scene
export default function HeroScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x: x * 0.6, y: y * 0.6 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    // Graceful fallback
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-brand-600/30 to-cyan-500/20 blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-6, -4, -2]} intensity={1.4} color="#6366f1" />
          <pointLight position={[6, 4, 3]} intensity={1.4} color="#06b6d4" />

          {/* Floating Ambient Sparkles */}
          <Sparkles count={45} scale={8} size={2.5} speed={0.4} color="#a5b4fc" />

          {/* Core Kinetic Geometry */}
          <HolographicCore mousePos={mousePos} />

          {/* Floating Course/Knowledge Elements */}
          <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
            <FloatingBook
              position={[-2.4, 0.9, 0.4]}
              rotation={[0.3, 0.5, -0.2]}
              color="#4f46e5"
              scale={0.9}
            />
          </Float>

          <Float speed={2.2} rotationIntensity={1.4} floatIntensity={1.8}>
            <FloatingBook
              position={[2.3, -0.7, 0.8]}
              rotation={[-0.2, -0.6, 0.3]}
              color="#0284c7"
              scale={0.85}
            />
          </Float>

          <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2}>
            <FloatingBook
              position={[2.0, 1.4, -0.6]}
              rotation={[0.4, -0.3, -0.1]}
              color="#9333ea"
              scale={0.75}
            />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
