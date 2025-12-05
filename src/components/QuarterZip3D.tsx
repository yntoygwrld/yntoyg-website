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

  // Slow rotation + gentle bounce animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      // Gentle bounce
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group ref={groupRef} scale={1.0}>
        {/* Main body - more rounded */}
        <RoundedBox
          args={[2.0, 2.4, 0.9]}
          radius={0.5}
          smoothness={8}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Collar - more rounded */}
        <RoundedBox
          args={[1.2, 0.45, 0.7]}
          radius={0.2}
          smoothness={8}
          position={[0, 1.4, 0.05]}
        >
          <meshStandardMaterial
            color={GOLD_LIGHT}
            roughness={0.5}
            metalness={0.5}
          />
        </RoundedBox>

        {/* Quarter zipper */}
        <RoundedBox
          args={[0.08, 1.0, 0.12]}
          radius={0.03}
          smoothness={4}
          position={[0, 0.8, 0.5]}
        >
          <meshStandardMaterial
            color={GOLD_ACCENT}
            roughness={0.2}
            metalness={0.9}
          />
        </RoundedBox>

        {/* Zipper pull */}
        <RoundedBox
          args={[0.12, 0.12, 0.08]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.25, 0.55]}
        >
          <meshStandardMaterial
            color={GOLD_ACCENT}
            roughness={0.15}
            metalness={0.95}
          />
        </RoundedBox>

        {/* Left sleeve - more rounded, softer */}
        <RoundedBox
          args={[1.3, 0.6, 0.6]}
          radius={0.25}
          smoothness={8}
          position={[-1.3, 0.7, 0]}
          rotation={[0, 0, 0.5]}
        >
          <meshStandardMaterial
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Right sleeve - more rounded, softer */}
        <RoundedBox
          args={[1.3, 0.6, 0.6]}
          radius={0.25}
          smoothness={8}
          position={[1.3, 0.7, 0]}
          rotation={[0, 0, -0.5]}
        >
          <meshStandardMaterial
            color={GOLD_MAIN}
            roughness={0.6}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Bottom ribbing - more rounded */}
        <RoundedBox
          args={[2.1, 0.3, 0.95]}
          radius={0.15}
          smoothness={8}
          position={[0, -1.3, 0]}
        >
          <meshStandardMaterial
            color={GOLD_DARK}
            roughness={0.7}
            metalness={0.3}
          />
        </RoundedBox>

        {/* Left cuff - rounder */}
        <RoundedBox
          args={[0.4, 0.22, 0.5]}
          radius={0.1}
          smoothness={6}
          position={[-1.8, 0.25, 0]}
          rotation={[0, 0, 0.5]}
        >
          <meshStandardMaterial
            color={GOLD_LIGHT}
            roughness={0.5}
            metalness={0.5}
          />
        </RoundedBox>

        {/* Right cuff - rounder */}
        <RoundedBox
          args={[0.4, 0.22, 0.5]}
          radius={0.1}
          smoothness={6}
          position={[1.8, 0.25, 0]}
          rotation={[0, 0, -0.5]}
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
    <div className="w-full h-[100px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />
        <pointLight
          position={[-5, 2, 3]}
          intensity={0.6}
          color="#fffaf0"
        />
        <pointLight
          position={[0, 0, 5]}
          intensity={0.5}
          color="#ffffff"
        />
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
