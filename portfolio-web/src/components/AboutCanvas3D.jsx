import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Inner solid dark icosahedron — gives depth behind the wireframes.
 */
const InnerCore = () => {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.004;
    ref.current.rotation.y += 0.006;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshBasicMaterial color={0x111133} transparent opacity={0.85} />
    </mesh>
  );
};

/**
 * Middle cyan wireframe — rotates in opposite direction.
 */
const CyanWire = () => {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x -= 0.003;
    ref.current.rotation.y += 0.005;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshBasicMaterial color={0x00f0ff} wireframe />
    </mesh>
  );
};

/**
 * Outer purple wireframe — low opacity, slow counter-rotation.
 */
const PurpleWire = () => {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.002;
    ref.current.rotation.y -= 0.003;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.85, 0]} />
      <meshBasicMaterial color={0xb14aff} wireframe transparent opacity={0.5} />
    </mesh>
  );
};

/**
 * Pink orbiting particle cloud — 80 particles in a sphere shell.
 */
const OrbitalParticles = () => {
  const ref = useRef();

  const positions = React.useMemo(() => {
    const COUNT = 80;
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r     = 2.2 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.004;
    ref.current.rotation.x += 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={0xff2e88}
        size={0.05}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/**
 * AboutCanvas3D — spinning nested icosahedron for the About section.
 * Drop this into the left column of the about grid.
 */
const AboutCanvas3D = () => {
  return (
    <div style={{ width: '100%', height: '420px' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <InnerCore />
        <CyanWire />
        <PurpleWire />
        <OrbitalParticles />
      </Canvas>
    </div>
  );
};

export default AboutCanvas3D;
