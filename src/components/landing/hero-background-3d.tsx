'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT = '#A16207';
const PRIMARY = '#1E3A5F';
const SECONDARY = '#2563EB';

interface SceneProps {
  pointer: { x: number; y: number };
  scrollProgress: number;
  quality: number;
}

function UniversityScene({ pointer, scrollProgress, quality }: SceneProps) {
  const group = useRef<THREE.Group>(null);

  // Create university/tech themed objects: books, code brackets, graduation caps, atoms
  const objects = useMemo(() => {
    const count = Math.max(6, Math.round(12 * quality));
    return Array.from({ length: count }, (_, i) => {
      const type = i % 4; // 0: book, 1: code bracket, 2: graduation cap, 3: atom
      const theta = (i / count) * Math.PI * 2;
      const r = 3 + (i % 3) * 1.2;
      const height = (i % 5 - 2) * 1.5;
      return {
        type,
        position: [
          Math.cos(theta) * r,
          height,
          Math.sin(theta) * r,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        speed: 0.15 + (i % 5) * 0.06,
        floatOffset: Math.random() * Math.PI * 2,
        scale: 0.8 + (i % 3) * 0.15,
        isAccent: i % 4 === 0,
      };
    });
  }, [quality]);

  const connections = useMemo(() => {
    const segs: Array<[THREE.Vector3, THREE.Vector3]> = [];
    objects.forEach((n, i) => {
      const a = new THREE.Vector3(...n.position);
      const b = new THREE.Vector3(...objects[(i + 1) % objects.length].position);
      segs.push([a, b]);
      if (i % 3 === 0) {
        const c = new THREE.Vector3(...objects[(i + 2) % objects.length].position);
        segs.push([a, c]);
      }
    });
    return segs;
  }, [objects]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Gentle rotation based on scroll
    group.current.rotation.y += delta * 0.03;

    // Parallax from pointer
    group.current.rotation.x += (pointer.y * 0.1 - group.current.rotation.x) * 0.02;
    group.current.position.x += (pointer.x * 0.3 - group.current.position.x) * 0.02;

    // Scale based on scroll progress - bring scene forward slightly
    const scale = 1 + scrollProgress * 0.15;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      {objects.map((obj, i) => (
        <UniversityObject key={i} {...obj} />
      ))}
      {connections.map((pair, i) => (
        <ConnectionLine key={`conn${i}`} a={pair[0]} b={pair[1]} />
      ))}
    </group>
  );
}

function UniversityObject({
  type,
  position,
  rotation,
  speed,
  floatOffset,
  scale,
  isAccent,
}: {
  type: number;
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  floatOffset: number;
  scale: number;
  isAccent: boolean;
}) {
  const mesh = useRef<THREE.Group>(null);
  const initialY = useRef(position[1]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed + floatOffset;
    mesh.current.position.y = initialY.current + Math.sin(t) * 0.3;
    mesh.current.rotation.x = rotation[0] + t * 0.2;
    mesh.current.rotation.y = rotation[1] + t * 0.15;
    mesh.current.rotation.z = rotation[2] + t * 0.1;
  });

  const color = isAccent ? ACCENT : PRIMARY;
  const emissiveColor = isAccent ? ACCENT : '#000000';
  const emissiveIntensity = isAccent ? 0.4 : 0;

  return (
    <group ref={mesh} position={position} scale={scale}>
      {/* Book */}
      {type === 0 && (
        <>
          <mesh>
            <boxGeometry args={[1, 1.3, 0.15]} />
            <meshStandardMaterial
              color={color}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
          {/* Book pages */}
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[0.9, 1.2, 0.02]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Code Brackets */}
      {type === 1 && (
        <group>
          <mesh position={[-0.35, 0, 0]}>
            <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0.35, 0, 0]} rotation={[0, Math.PI, 0]}>
            <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      )}

      {/* Graduation Cap */}
      {type === 2 && (
        <group>
          {/* Cap top */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
            <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Cap base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.4, 0.35, 0.15, 32]} />
            <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Tassel */}
          <mesh position={[0.35, -0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
            <meshStandardMaterial color={ACCENT} roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Atom/Molecule */}
      {type === 3 && (
        <group>
          {/* Nucleus */}
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.6} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Orbiting electrons */}
          <mesh position={[0.4, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={SECONDARY} roughness={0.4} />
          </mesh>
          <mesh position={[-0.3, 0.25, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={SECONDARY} roughness={0.4} />
          </mesh>
          <mesh position={[-0.3, -0.25, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={SECONDARY} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function ConnectionLine({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([a, b]);
    const m = new THREE.LineBasicMaterial({
      color: PRIMARY,
      transparent: true,
      opacity: 0.15,
    });
    return new THREE.Line(g, m);
  }, [a, b]);

  return <primitive object={line} />;
}

function CameraRig({ pointer }: { pointer: { x: number; y: number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.2 - camera.position.x) * 0.015;
    camera.position.y += (-pointer.y * 0.15 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function StaticFallback() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-30"
      viewBox="0 0 400 300"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#A16207" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Floating geometric shapes representing university/tech */}
      <g fill="url(#grad)">
        {/* Books */}
        <rect x="60" y="80" width="40" height="55" rx="2" fill="#1E3A5F" opacity="0.4" />
        <rect x="62" y="82" width="36" height="51" rx="1" fill="#F8FAFC" opacity="0.6" />
        <rect x="200" y="180" width="35" height="48" rx="2" fill="#1E3A5F" opacity="0.4" transform="rotate(-15 217.5 204)" />
        <rect x="202" y="182" width="31" height="44" rx="1" fill="#F8FAFC" opacity="0.5" transform="rotate(-15 217.5 204)" />
        <rect x="320" y="60" width="38" height="52" rx="2" fill="#A16207" opacity="0.5" transform="rotate(10 339 86)" />
        <rect x="322" y="62" width="34" height="48" rx="1" fill="#F8FAFC" opacity="0.5" transform="rotate(10 339 86)" />

        {/* Code brackets */}
        <path d="M100 140 Q80 130 100 120" stroke="#2563EB" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M100 140 Q120 130 100 120" stroke="#2563EB" strokeWidth="3" fill="none" opacity="0.5" transform="rotate(180 100 130)" />
        <path d="M280 220 Q260 210 280 200" stroke="#1E3A5F" strokeWidth="3" fill="none" opacity="0.4" />
        <path d="M280 220 Q300 210 280 200" stroke="#1E3A5F" strokeWidth="3" fill="none" opacity="0.4" transform="rotate(180 280 210)" />

        {/* Graduation caps */}
        <path d="M140 240 L120 220 L160 220 Z" fill="#1E3A5F" opacity="0.4" />
        <rect x="118" y="220" width="44" height="8" fill="#1E3A5F" opacity="0.4" />
        <path d="M340 120 L320 100 L360 100 Z" fill="#A16207" opacity="0.5" transform="rotate(-5 340 110)" />
        <rect x="318" y="100" width="44" height="7" fill="#A16207" opacity="0.5" transform="rotate(-5 340 110)" />

        {/* Connecting lines */}
        <line x1="60" y1="80" x2="140" y2="240" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />
        <line x1="200" y1="180" x2="280" y2="220" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />
        <line x1="320" y1="60" x2="340" y2="120" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />
        <line x1="140" y1="240" x2="200" y2="180" stroke="#CBD5E1" strokeWidth="0.5" opacity="0.3" />
      </g>
    </svg>
  );
}

export function HeroBackground3D() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.innerWidth < 768;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) < 4;
    if (reduced || smallScreen || lowEnd) {
      setUseFallback(true);
    }
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      setScrollProgress(Math.min(scrollY / maxScroll, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return <div className="absolute inset-0" aria-hidden="true" />;

  if (useFallback) {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        <StaticFallback />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 7]} intensity={2} color="#FFFFFF" />
        <pointLight position={[-4, 5, 3]} intensity={1.5} color={ACCENT} />
        <pointLight position={[4, -2, 5]} intensity={1} color={SECONDARY} />
        <UniversityScene pointer={pointer} scrollProgress={scrollProgress} quality={1} />
        <CameraRig pointer={pointer} />
      </Canvas>
    </div>
  );
}