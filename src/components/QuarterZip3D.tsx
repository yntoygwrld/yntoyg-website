'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// Colors - lighter navy to stand out from dark background
const NAVY_BLUE = '#2a3a5c';
const GOLD = '#D4AF37';
const LIGHTER_NAVY = '#3d4d6e';
const DARK_ACCENT = '#1e2d4a';

function QuarterZipModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group ref={groupRef}>
        {/* Main body of the sweater */}
        <RoundedBox
          args={[2.2, 2.8, 0.8]}
          radius={0.15}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={NAVY_BLUE}
            roughness={0.8}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Collar - ribbed effect */}
        <RoundedBox
          args={[1.4, 0.5, 0.6]}
          radius={0.1}
          smoothness={4}
          position={[0, 1.6, 0.05]}
        >
          <meshStandardMaterial
            color={LIGHTER_NAVY}
            roughness={0.9}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Quarter zipper - gold accent */}
        <RoundedBox
          args={[0.08, 1.2, 0.1]}
          radius={0.02}
          smoothness={4}
          position={[0, 0.9, 0.45]}
        >
          <meshStandardMaterial
            color={GOLD}
            roughness={0.3}
            metalness={0.8}
          />
        </RoundedBox>

        {/* Zipper pull - gold */}
        <RoundedBox
          args={[0.15, 0.15, 0.08]}
          radius={0.03}
          smoothness={4}
          position={[0, 0.25, 0.5]}
        >
          <meshStandardMaterial
            color={GOLD}
            roughness={0.2}
            metalness={0.9}
          />
        </RoundedBox>

        {/* Left sleeve */}
        <RoundedBox
          args={[1.8, 0.7, 0.6]}
          radius={0.1}
          smoothness={4}
          position={[-1.8, 0.8, 0]}
          rotation={[0, 0, 0.4]}
        >
          <meshStandardMaterial
            color={NAVY_BLUE}
            roughness={0.8}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Right sleeve */}
        <RoundedBox
          args={[1.8, 0.7, 0.6]}
          radius={0.1}
          smoothness={4}
          position={[1.8, 0.8, 0]}
          rotation={[0, 0, -0.4]}
        >
          <meshStandardMaterial
            color={NAVY_BLUE}
            roughness={0.8}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Bottom ribbing */}
        <RoundedBox
          args={[2.3, 0.3, 0.85]}
          radius={0.08}
          smoothness={4}
          position={[0, -1.5, 0]}
        >
          <meshStandardMaterial
            color={LIGHTER_NAVY}
            roughness={0.9}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Left cuff */}
        <RoundedBox
          args={[0.5, 0.25, 0.5]}
          radius={0.05}
          smoothness={4}
          position={[-2.5, 0.35, 0]}
          rotation={[0, 0, 0.4]}
        >
          <meshStandardMaterial
            color={LIGHTER_NAVY}
            roughness={0.9}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Right cuff */}
        <RoundedBox
          args={[0.5, 0.25, 0.5]}
          radius={0.05}
          smoothness={4}
          position={[2.5, 0.35, 0]}
          rotation={[0, 0, -0.4]}
        >
          <meshStandardMaterial
            color={LIGHTER_NAVY}
            roughness={0.9}
            metalness={0.05}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

export default function QuarterZip3D() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.6} />

        {/* Main light from top-right - brighter */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          color="#ffffff"
        />

        {/* Gold accent light from left - stronger */}
        <pointLight
          position={[-5, 2, 3]}
          intensity={1}
          color={GOLD}
        />

        {/* Front fill light */}
        <pointLight
          position={[0, 0, 5]}
          intensity={0.8}
          color="#ffffff"
        />

        {/* Subtle rim light from behind */}
        <pointLight
          position={[0, 0, -5]}
          intensity={0.5}
          color="#6a6a9a"
        />

        <QuarterZipModel />
      </Canvas>
    </div>
  );
}
