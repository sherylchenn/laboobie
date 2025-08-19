"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

// Vertex shader for Chladni pattern
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for Chladni pattern
const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uA;
  uniform float uB;
  uniform float uM;
  uniform float uN;
  uniform float uBaseScale;
  uniform float uStrokeWidth;
  uniform float uPeriod;
  uniform float uOffsetX;
  uniform float uOffsetY;
  uniform float uZoomLevel;
  
  const float BASE_SCALE = 80.;
  const float STROKE_WIDTH = 1.;
  const float PERIOD = 3.;
  const bool ROTATE_A_B = true;
  const float A = 1.;
  const float B = 1.;
  const float N = 6.;
  const float M = 7.;
  const float PI = 3.14159265359;
  const float TAU = 2. * PI;
  
  vec3 f(float x, float y, float a, float b, float n, float m) {
    return vec3(
      a * sin(PI*n*x) * sin(PI*m*y) + b * sin(PI*m*x) * sin(PI*n*y),
      PI * (a * n * cos(PI*n*x) * sin(PI*m*y) + b * m * cos(PI*m*x) * sin(PI*n*y)),       
      PI * (a * m * sin(PI*n*x) * cos(PI*m*y) + b * n * sin(PI*m*x) * cos(PI*n*y))
    );
  }
  
  void main() {
    float scale = (BASE_SCALE * uBaseScale) / min(uResolution.x, uResolution.y);
    vec2 uv = (2.0 * vUv - 1.0) * vec2(uResolution.x/uResolution.y, 1.0);
    
    // Apply scale to UV coordinates like in the example
    uv = uv * scale;
    
    // Apply zoom and offset
    uv = uv * uZoomLevel + vec2(uOffsetX, uOffsetY);
    
    float t = (fract(uTime / (PERIOD * uPeriod)) + .125) * TAU;
    float a = ROTATE_A_B ? cos(t) * uA : A * uA;
    float b = ROTATE_A_B ? sin(t) * uB : B * uB;
    
    vec3 pattern = f(uv.x, uv.y, a, b, N * uN, M * uM);
    float d = abs(pattern.x) / length(pattern.yz);
    float col = smoothstep((STROKE_WIDTH * uStrokeWidth)+1., (STROKE_WIDTH * uStrokeWidth)-1., d/2./scale);
    
    // Soft white background with black strokes (not overexposed)
    vec3 backgroundColor = vec3(0.8, 0.8, 0.8); // Soft white
    vec3 strokeColor = vec3(0.0, 0.0, 0.0); // Black
    vec3 finalColor = mix(backgroundColor, strokeColor, col);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create the custom shader material
const ChladniMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(512, 512),
    uA: 1.0,
    uB: 1.0,
    uM: 1.0,
    uN: 1.0,
    uBaseScale: 1.0,
    uStrokeWidth: 1.0,
    uPeriod: 1.0,
    uOffsetX: 0.0,
    uOffsetY: 0.0,
    uZoomLevel: 1,
  },
  vertexShader,
  fragmentShader,
);

// Extend the material for use in JSX
extend({ ChladniMaterial });

// TypeScript declaration for the custom material
declare module "@react-three/fiber" {
  interface ThreeElements {
    chladniMaterial: any;
  }
}

// Interface for the ref
export interface ChladniSphereRef {
  A: number;
  B: number;
  M: number;
  N: number;
  baseScale: number;
  strokeWidth: number;
  time: number;
}

// Interface for the props
export interface ChladniSphereProps {
  A?: number;
  B?: number;
  M?: number;
  N?: number;
  baseScale?: number;
  strokeWidth?: number;
  time?: number;
}

export const ChladniSphere = forwardRef<ChladniSphereRef, ChladniSphereProps>(
  (props: ChladniSphereProps, ref) => {
    const {
      A = 1.0,
      B = 1.0,
      M = 1.0,
      N = 2.7,
      baseScale = 1.0,
      strokeWidth = 0.7,
      time = 0,
      ...meshProps
    } = props;

    const materialRef = useRef<any>(null);
    const parametersRef = useRef<ChladniSphereRef>({
      A,
      B,
      M,
      N,
      baseScale,
      strokeWidth,
      time,
    });

    // Sync props to parametersRef when they change
    useEffect(() => {
      parametersRef.current.A = A;
      parametersRef.current.B = B;
      parametersRef.current.M = M;
      parametersRef.current.N = N;
      parametersRef.current.baseScale = baseScale;
      parametersRef.current.strokeWidth = strokeWidth;
      parametersRef.current.time = time;
    }, [A, B, M, N, baseScale, strokeWidth, time]);

    useImperativeHandle(ref, () => ({
      get A() {
        return parametersRef.current.A;
      },
      set A(value: number) {
        parametersRef.current.A = value;
      },
      get B() {
        return parametersRef.current.B;
      },
      set B(value: number) {
        parametersRef.current.B = value;
      },
      get M() {
        return parametersRef.current.M;
      },
      set M(value: number) {
        parametersRef.current.M = value;
      },
      get N() {
        return parametersRef.current.N;
      },
      set N(value: number) {
        parametersRef.current.N = value;
      },
      get baseScale() {
        return parametersRef.current.baseScale;
      },
      set baseScale(value: number) {
        parametersRef.current.baseScale = value;
      },
      get strokeWidth() {
        return parametersRef.current.strokeWidth;
      },
      set strokeWidth(value: number) {
        parametersRef.current.strokeWidth = value;
      },
      get time() {
        return parametersRef.current.time;
      },
      set time(value: number) {
        parametersRef.current.time = value;
      },
    }));

    useFrame((state) => {
      if (materialRef.current?.uniforms) {
        const uniforms = materialRef.current.uniforms;

        // Safely update each uniform if it exists
        if (uniforms.uTime != null)
          uniforms.uTime.value = parametersRef.current.time;
        if (uniforms.uA != null) uniforms.uA.value = parametersRef.current.A;
        if (uniforms.uB != null) uniforms.uB.value = parametersRef.current.B;
        if (uniforms.uM != null) uniforms.uM.value = parametersRef.current.M;
        if (uniforms.uN != null) uniforms.uN.value = parametersRef.current.N;
        if (uniforms.uBaseScale != null)
          uniforms.uBaseScale.value = parametersRef.current.baseScale;
        if (uniforms.uStrokeWidth != null)
          uniforms.uStrokeWidth.value = parametersRef.current.strokeWidth;
        if (uniforms.uResolution != null)
          uniforms.uResolution.value?.set?.(600, 600);
      }
    });

    return (
      <mesh {...meshProps}>
        <sphereGeometry args={[2, 64, 64]} />
        <chladniMaterial ref={materialRef} />
      </mesh>
    );
  },
);

ChladniSphere.displayName = "ChladniSphere";
