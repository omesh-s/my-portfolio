"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { inSphere } from "maath/random";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import * as THREE from "three";

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const reduced = usePrefersReducedMotion();

  const positions = useMemo(() => {
    // Keep it lightweight: enough density to read as “space” but not heavy.
    // maath typings can widen to TypedArray; force Float32Array for drei Points.
    return inSphere(new Float32Array(3200 * 3), { radius: 1.35 }) as Float32Array;
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    if (!ref.current) return;
    ref.current.rotation.x -= delta * 0.05;
    ref.current.rotation.y -= delta * 0.035;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0022}
          sizeAttenuation
          depthWrite={false}
          opacity={0.55}
        />
      </Points>
    </group>
  );
}

export function StarsCanvas() {
  const reduced = usePrefersReducedMotion();
  // If user prefers reduced motion, we still show stars but don’t animate.
  return (
    <div
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <StarField />
        {/* Subtle purple haze */}
        <color attach="background" args={["#07080b"]} />
        {!reduced && <ambientLight intensity={0.35} />}
      </Canvas>
    </div>
  );
}

