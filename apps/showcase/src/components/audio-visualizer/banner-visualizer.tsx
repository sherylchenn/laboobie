"use client";

import { Text, shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ChladniSphere, type ChladniSphereRef } from "./chladni";
interface Analyzer {
  bass: { get: () => number };
  lowMid: { get: () => number };
  mid: { get: () => number };
  highMid: { get: () => number };
  peak: { get: () => number };
}
// Custom gradient shader material
const GradientMaterial = shaderMaterial(
  {
    topColor: new THREE.Color(1, 0.3, 0.3), // Bright red
    bottomColor: new THREE.Color(0.2, 0, 0), // Dark red
    opacity: 0.5,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float opacity;
    varying vec2 vUv;
    
    void main() {
      vec3 color = mix(bottomColor, topColor, vUv.y);
      gl_FragColor = vec4(color, opacity);
    }
  `,
);

// Extend the material so it can be used as JSX
extend({ GradientMaterial });

// TypeScript declaration for the extended material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientMaterial: any;
    }
  }
}

interface GradientColorConfig {
  topColor: THREE.Color;
  bottomColor: THREE.Color;
  textColor: THREE.Color;
}

const GRADIENT_COLORS: Record<string, GradientColorConfig> = {
  red: {
    topColor: new THREE.Color(1, 0.4, 0.4),
    bottomColor: new THREE.Color(0.4, 0, 0),
    textColor: new THREE.Color(1, 0.996, 0.82),
  },
  orange: {
    topColor: new THREE.Color(1, 0.62, 0.32),
    bottomColor: new THREE.Color(0.7, 0.27, 0.15),
    textColor: new THREE.Color(1, 0.957, 0.824),
  },
  green: {
    topColor: new THREE.Color(0.204, 0.929, 0.494),
    bottomColor: new THREE.Color(0.063, 0.337, 0.173),
    textColor: new THREE.Color(1, 0.996, 0.824),
  },
  cyan: {
    topColor: new THREE.Color(0.243, 0.847, 0.847),
    bottomColor: new THREE.Color(0.067, 0.31, 0.31),
    textColor: new THREE.Color(0.902, 1, 0.902),
  },
  blue: {
    topColor: new THREE.Color(0.008, 0.416, 0.827),
    bottomColor: new THREE.Color(0.051, 0.137, 0.337),
    textColor: new THREE.Color(1, 0.89, 0.902),
  },
  purple: {
    topColor: new THREE.Color(0.7, 0.4, 1),
    bottomColor: new THREE.Color(0.25, 0.05, 0.45),
    textColor: new THREE.Color(0.902, 0.973, 1),
  },
  black: {
    topColor: new THREE.Color(0.1, 0.1, 0.1),
    bottomColor: new THREE.Color(0.08, 0.08, 0.08),
    textColor: new THREE.Color(0.95, 0.95, 0.95),
  },
};

function VisualizerScene({
  analyzer,
  isPlaying,
}: {
  analyzer: Analyzer | null;
  isPlaying: boolean;
}) {
  const sphereRef = useRef<ChladniSphereRef>(null);
  const timeRef = useRef(0);
  const frameCountRef = useRef(0);
  const hasLoggedRef = useRef(false);

  // Log once when analyzer is received
  if (analyzer && !hasLoggedRef.current) {
    console.log("VisualizerScene received analyzer:", analyzer);
    hasLoggedRef.current = true;
  }

  // Use Three.js render loop
  useFrame((state, delta) => {
    if (analyzer && isPlaying && sphereRef.current) {
      // Get frequency band values
      const bassValue = analyzer.bass.get();
      const lowMidValue = analyzer.lowMid.get();
      const midValue = analyzer.mid.get();
      const highMidValue = analyzer.highMid.get();
      const peak = Math.max(analyzer.peak.get(), 0.6);

      // Debug logging
      frameCountRef.current++;
      if (frameCountRef.current % 60 === 0) {
        console.log("Visualizer - Audio values:", {
          bassValue,
          lowMidValue,
          midValue,
          highMidValue,
          peak,
          isPlaying,
          hasAnalyzer: !!analyzer,
          hasSphere: !!sphereRef.current,
        });
      }

      // Update time based on audio energy
      timeRef.current += (((lowMidValue + highMidValue) * delta) / 1420) % 600;

      // Update sphere parameters based on audio
      sphereRef.current.time = timeRef.current;
      sphereRef.current.A = bassValue;
      sphereRef.current.B = 1 - (midValue + highMidValue) / 2;

      const baseM = 1.0;
      const baseN = 2.7;
      const sensitivity = 0.1;

      sphereRef.current.M = baseM - (highMidValue / peak) ** 1.6 * sensitivity;
      sphereRef.current.N = baseN + (midValue / peak) ** 1.6 * sensitivity;
      sphereRef.current.baseScale = 1.0 + bassValue * 0.2;
      sphereRef.current.strokeWidth = 0.675 + bassValue * 0.5;
    } else if (sphereRef.current) {
      // Idle animation when not playing
      timeRef.current += delta * 0.5;
      sphereRef.current.time = timeRef.current;
      sphereRef.current.A = 0.5;
      sphereRef.current.B = 0.8;
      sphereRef.current.M = 1.0;
      sphereRef.current.N = 2.7;
      sphereRef.current.baseScale = 1.0;
      sphereRef.current.strokeWidth = 0.675;
    }
  });

  return (
    <>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.25} />
      <group position={[0, 0, 2]}>
        <group rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0, 4.5]}>
          <ChladniSphere ref={sphereRef} baseScale={1} strokeWidth={0.675} />
        </group>
      </group>

      <mesh position={[0, 0, 8.5]}>
        <planeGeometry args={[8, 8]} />
        {/* @ts-ignore - gradientMaterial is extended dynamically */}
        <gradientMaterial
          topColor={GRADIENT_COLORS.black.topColor}
          bottomColor={GRADIENT_COLORS.black.bottomColor}
          opacity={0.9}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export function BannerVisualizer({
  analyser,
  isPlaying,
}: {
  analyser: Analyzer | null;
  isPlaying: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 14], fov: 40 }}>
      <VisualizerScene analyzer={analyser} isPlaying={isPlaying} />
    </Canvas>
  );
}
