'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// Golden color scheme matching YG brand
const GOLD_MAIN = '#D4AF37';
const GOLD_LIGHT = '#e6c55a';
const GOLD_DARK = '#b8962e';
const GOLD_ACCENT = '#f5e6a3';

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
      <group ref={groupRef} scale={1.0}>
        {/* Main body of the sweater */}
        <RoundedBox
          args={[2.2, 2.8, 0.8]}
          radius={0.15}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
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
            color={GOLD_LIGHT}
            roughness={0.5}
            metalness={0.5}
          />
        </RoundedBox>

        {/* Quarter zipper - lighter gold accent */}
        <RoundedBox
          args={[0.08, 1.2, 0.1]}
          radius={0.02}
          smoothness={4}
          position={[0, 0.9, 0.45]}
        >
          <meshStandardMaterial
            color={GOLD_ACCENT}
            roughness={0.2}
            metalness={0.9}
          />
        </RoundedBox>

        {/* Zipper pull */}
        <RoundedBox
          args={[0.15, 0.15, 0.08]}
          radius={0.03}
          smoothness={4}
          position={[0, 0.25, 0.5]}
        >
          <meshStandardMaterial
            color={GOLD_ACCENT}
            roughness={0.15}
            metalness={0.95}
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
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
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
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
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
            color={GOLD_DARK}
            roughness={0.7}
            metalness={0.3}
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
            color={GOLD_LIGHT}
            roughness={0.5}
            metalness={0.5}
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
            color={GOLD_LIGHT}
            roughness={0.5}
            metalness={0.5}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

export default function QuarterZip3D() {
  return (
    <div className="w-full h-[250px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.5} />

        {/* Main light from top-right */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Warm accent light from left */}
        <pointLight
          position={[-5, 2, 3]}
          intensity={0.6}
          color="#fffaf0"
        />

        {/* Front fill light */}
        <pointLight
          position={[0, 0, 5]}
          intensity={0.5}
          color="#ffffff"
        />

        {/* Subtle rim light from behind */}
        <pointLight
          position={[0, 0, -5]}
          intensity={0.3}
          color="#D4AF37"
        />

        <QuarterZipModel />
      </Canvas>
    </div>
  );
}
