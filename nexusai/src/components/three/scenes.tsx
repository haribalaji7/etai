'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeuralGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const hovered = useRef(false);

  const { nodes, edges } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 2.5;
      pts.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ));
    }
    const edgeList: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.0) {
          edgeList.push([i, j]);
        }
      }
    }
    return { nodes: pts, edges: edgeList };
  }, []);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr[i * 6] = nodes[a].x; arr[i * 6 + 1] = nodes[a].y; arr[i * 6 + 2] = nodes[a].z;
      arr[i * 6 + 3] = nodes[b].x; arr[i * 6 + 4] = nodes[b].y; arr[i * 6 + 5] = nodes[b].z;
    });
    return arr;
  }, [nodes, edges]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const speed = hovered.current ? 0.4 : 0.15;
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => { hovered.current = true; }}
      onPointerOut={() => { hovered.current = false; }}
    >
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.8} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

export function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2 + Math.sin(i * 1.5) * 0.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(i * 0.7) * 1.5, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.15 + i * 0.02, 16, 16]} />
            <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export function RotatingShape({ shape = 'torus' }: { shape?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'torus': return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
      case 'octahedron': return <octahedronGeometry args={[0.6]} />;
      case 'box': return <boxGeometry args={[0.7, 0.7, 0.7]} />;
      case 'icosahedron': return <icosahedronGeometry args={[0.6]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.6]} />;
      case 'cone': return <coneGeometry args={[0.5, 0.8, 6]} />;
      default: return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
    }
  }, [shape]);

  return (
    <mesh ref={ref}>
      {geometry}
      <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} wireframe />
    </mesh>
  );
}

export function AIHealthSphere({ load = 0.5 }: { load?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (matRef.current) {
      const green = new THREE.Color('#22c55e');
      const amber = new THREE.Color('#f59e0b');
      const red = new THREE.Color('#ef4444');
      const color = load < 0.5 ? green.clone().lerp(amber, load * 2) : amber.clone().lerp(red, (load - 0.5) * 2);
      matRef.current.emissive = color;
      matRef.current.color = color;
      matRef.current.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial ref={matRef} transparent opacity={0.8} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

export function Scene3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Canvas className={className} camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#7c3aed" />
      {children}
    </Canvas>
  );
}
