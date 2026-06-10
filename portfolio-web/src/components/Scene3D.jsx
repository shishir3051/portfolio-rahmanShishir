import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Palette colours shared across components ──────────────────────────────────
const PALETTE = [
  new THREE.Color(0x00f0ff), // cyan
  new THREE.Color(0xb14aff), // purple
  new THREE.Color(0xff2e88), // pink
];

// ── 1200 coloured particles ───────────────────────────────────────────────────
const ParticleField = () => {
  const ref = useRef();
  const COUNT = 1200;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      const c = PALETTE[i % 3];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0008;
    ref.current.rotation.x += 0.0004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// ── Floating wireframe geometry ───────────────────────────────────────────────
const FloatingShape = ({ geometry, color, position, rotSpeed, floatSpeed, floatOffset }) => {
  const ref = useRef();
  const t = useRef(floatOffset);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += rotSpeed.x;
    ref.current.rotation.y += rotSpeed.y;
    t.current += floatSpeed;
    ref.current.position.y = position[1] + Math.sin(t.current) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      {geometry}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
    </mesh>
  );
};

// ── Six floating shapes ───────────────────────────────────────────────────────
const FloatingShapes = () => {
  const shapes = useMemo(() => [
    {
      geometry: <icosahedronGeometry args={[0.6, 0]} />,
      color: PALETTE[0],
      position: [-5, 2, -4],
      rotSpeed: { x: 0.004, y: 0.006 },
      floatSpeed: 0.002,
      floatOffset: 0,
    },
    {
      geometry: <torusGeometry args={[0.5, 0.18, 16, 40]} />,
      color: PALETTE[1],
      position: [6, -1, -3],
      rotSpeed: { x: 0.003, y: 0.005 },
      floatSpeed: 0.0025,
      floatOffset: 2,
    },
    {
      geometry: <octahedronGeometry args={[0.6, 0]} />,
      color: PALETTE[2],
      position: [-3, -3, -5],
      rotSpeed: { x: 0.005, y: 0.003 },
      floatSpeed: 0.0018,
      floatOffset: 4,
    },
    {
      geometry: <torusKnotGeometry args={[0.4, 0.14, 80, 16]} />,
      color: PALETTE[0],
      position: [4, 3, -6],
      rotSpeed: { x: 0.002, y: 0.004 },
      floatSpeed: 0.003,
      floatOffset: 1,
    },
    {
      geometry: <icosahedronGeometry args={[0.5, 0]} />,
      color: PALETTE[1],
      position: [2, -4, -2],
      rotSpeed: { x: 0.006, y: 0.002 },
      floatSpeed: 0.0022,
      floatOffset: 3,
    },
    {
      geometry: <octahedronGeometry args={[0.7, 0]} />,
      color: PALETTE[2],
      position: [-7, 1, -5],
      rotSpeed: { x: 0.003, y: 0.006 },
      floatSpeed: 0.0015,
      floatOffset: 5,
    },
  ], []);

  return (
    <>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
};

// ── Camera rig — follows mouse + scroll ───────────────────────────────────────
const CameraRig = ({ mouseRef, scrollRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    const targetX = mouseRef.current.x * 2;
    const targetY = -mouseRef.current.y * 2;
    const targetZ = 8 + scrollRef.current * 0.0015;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ── Root Scene3D component ────────────────────────────────────────────────────
const Scene3D = () => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} />
        <ParticleField />
        <FloatingShapes />
      </Canvas>
    </div>
  );
};

export default Scene3D;
