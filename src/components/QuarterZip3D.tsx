'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// Colors matching website theme
const CREAM_WHITE = '#e8e4dc';      // Main body - matches "From/to" text
const CREAM_LIGHT = '#f5f0e6';      // Collar/cuffs - lighter accent
const CREAM_DARK = '#d4cfc5';       // Bottom ribbing - subtle contrast
const GOLD = '#D4AF37';             // Zipper - matches YG gold
const GOLD_BRIGHT = '#e6c55a';      // Zipper highlight

function QuarterZipModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Slow, elegant rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.15}
      floatIntensity={0.4}
    >
      <group ref={groupRef} scale={1.6}>
        {/* Main body of the sweater - more rounded */}
        <RoundedBox
          args={[2.4, 3.0, 1.0]}
          radius={0.25}
          smoothness={8}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.85}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Body detail - subtle chest panel */}
        <RoundedBox
          args={[1.8, 2.2, 0.15]}
          radius={0.2}
          smoothness={6}
          position={[0, 0.2, 0.5]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.9}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Collar - taller, more prominent */}
        <RoundedBox
          args={[1.6, 0.7, 0.8]}
          radius={0.2}
          smoothness={8}
          position={[0, 1.75, 0.05]}
        >
          <meshStandardMaterial
            color={CREAM_LIGHT}
            roughness={0.75}
            metalness={0.08}
          />
        </RoundedBox>

        {/* Collar ribbing detail - front */}
        <RoundedBox
          args={[1.2, 0.6, 0.12]}
          radius={0.1}
          smoothness={6}
          position={[0, 1.75, 0.42]}
        >
          <meshStandardMaterial
            color={CREAM_LIGHT}
            roughness={0.95}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Quarter zipper track - gold */}
        <RoundedBox
          args={[0.12, 1.4, 0.15]}
          radius={0.04}
          smoothness={6}
          position={[0, 0.95, 0.58]}
        >
          <meshStandardMaterial
            color={GOLD}
            roughness={0.25}
            metalness={0.85}
          />
        </RoundedBox>

        {/* Zipper teeth detail */}
        {[...Array(8)].map((_, i) => (
          <RoundedBox
            key={i}
            args={[0.18, 0.08, 0.08]}
            radius={0.02}
            smoothness={4}
            position={[0, 0.4 + i * 0.15, 0.62]}
          >
            <meshStandardMaterial
              color={GOLD_BRIGHT}
              roughness={0.2}
              metalness={0.9}
            />
          </RoundedBox>
        ))}

        {/* Zipper pull - elegant diamond shape */}
        <RoundedBox
          args={[0.2, 0.25, 0.12]}
          radius={0.06}
          smoothness={6}
          position={[0, 0.2, 0.65]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshStandardMaterial
            color={GOLD}
            roughness={0.15}
            metalness={0.95}
          />
        </RoundedBox>

        {/* Left sleeve - more rounded, natural angle */}
        <RoundedBox
          args={[2.0, 0.85, 0.75]}
          radius={0.2}
          smoothness={8}
          position={[-1.9, 0.7, 0]}
          rotation={[0, 0, 0.35]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.85}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Right sleeve */}
        <RoundedBox
          args={[2.0, 0.85, 0.75]}
          radius={0.2}
          smoothness={8}
          position={[1.9, 0.7, 0]}
          rotation={[0, 0, -0.35]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.85}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Left shoulder detail */}
        <RoundedBox
          args={[0.8, 0.5, 0.85]}
          radius={0.15}
          smoothness={6}
          position={[-1.0, 1.3, 0]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.85}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Right shoulder detail */}
        <RoundedBox
          args={[0.8, 0.5, 0.85]}
          radius={0.15}
          smoothness={6}
          position={[1.0, 1.3, 0]}
        >
          <meshStandardMaterial
            color={CREAM_WHITE}
            roughness={0.85}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Bottom ribbing - darker accent */}
        <RoundedBox
          args={[2.5, 0.4, 1.05]}
          radius={0.12}
          smoothness={8}
          position={[0, -1.6, 0]}
        >
          <meshStandardMaterial
            color={CREAM_DARK}
            roughness={0.9}
            metalness={0.03}
          />
        </RoundedBox>

        {/* Left cuff - matches collar */}
        <RoundedBox
          args={[0.6, 0.35, 0.65]}
          radius={0.1}
          smoothness={6}
          position={[-2.65, 0.25, 0]}
          rotation={[0, 0, 0.35]}
        >
          <meshStandardMaterial
            color={CREAM_LIGHT}
            roughness={0.75}
            metalness={0.08}
          />
        </RoundedBox>

        {/* Right cuff */}
        <RoundedBox
          args={[0.6, 0.35, 0.65]}
          radius={0.1}
          smoothness={6}
          position={[2.65, 0.25, 0]}
          rotation={[0, 0, -0.35]}
        >
          <meshStandardMaterial
            color={CREAM_LIGHT}
            roughness={0.75}
            metalness={0.08}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

export default function QuarterZip3D() {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[550px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Soft ambient light */}
        <ambientLight intensity={0.7} />

        {/* Main key light - warm white from top-right */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.2}
          color="#fffaf0"
        />

        {/* Gold accent light from left - creates warm glow on edges */}
        <pointLight
          position={[-6, 2, 4]}
          intensity={0.8}
          color={GOLD}
        />

        {/* Soft fill from front */}
        <pointLight
          position={[0, 1, 6]}
          intensity={0.5}
          color="#ffffff"
        />

        {/* Subtle rim light from behind - gold tint */}
        <pointLight
          position={[0, 2, -6]}
          intensity={0.4}
          color="#D4AF37"
        />

        {/* Bottom fill to show ribbing */}
        <pointLight
          position={[0, -4, 3]}
          intensity={0.3}
          color="#fffaf0"
        />

        <QuarterZipModel />
      </Canvas>
    </div>
  );
}
