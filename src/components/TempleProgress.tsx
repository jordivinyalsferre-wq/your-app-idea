import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { value: number; className?: string };

// 6 columnes + arquitrau + frontó = 8 etapes
const STAGES = 8;

const STONE = "#d9c9a8";
const STONE_DARK = "#a8957a";
const SUNSET = "#e87a3e";

function useEased(target: number, speed = 4) {
  const ref = useRef(target);
  useFrame((_, dt) => {
    ref.current += (target - ref.current) * Math.min(1, dt * speed);
  });
  return ref;
}

function Column({ x, builtAmount }: { x: number; builtAmount: number }) {
  // builtAmount: 0..1 — quant està reconstruïda aquesta columna
  const drumCount = 5;
  const drumH = 0.32;
  const baseY = 0.1;
  const eased = useEased(builtAmount, 5);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const v = eased.current;
    g.children.forEach((child, i) => {
      if (i === 0) return; // base
      const drumIdx = i - 1; // 0..drumCount-1 then capital
      const threshold = drumIdx / drumCount;
      const local = THREE.MathUtils.clamp((v - threshold) * drumCount, 0, 1);
      const targetY = baseY + 0.1 + drumIdx * drumH + drumH / 2;
      child.position.y = targetY - (1 - local) * 0.6;
      (child as THREE.Mesh).visible = local > 0.02;
      const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (m && "opacity" in m) {
        m.transparent = true;
        m.opacity = local;
      }
    });
  });

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* base */}
      <mesh position={[0, baseY, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.18, 0.5]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      {Array.from({ length: drumCount }).map((_, i) => (
        <mesh key={i} castShadow>
          <cylinderGeometry args={[0.2, 0.21, drumH, 16]} />
          <meshStandardMaterial color={STONE} roughness={0.85} />
        </mesh>
      ))}
      {/* capitell */}
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.12, 0.46]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Rubble({ x, hide }: { x: number; hide: number }) {
  // hide: 0..1 — 1 = invisible (ja reconstruïda)
  const eased = useEased(1 - hide, 4);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const v = eased.current;
    ref.current.scale.setScalar(0.0001 + v);
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.opacity = v;
  });
  return (
    <mesh ref={ref} position={[x, 0.16, 0.05]} rotation={[0, x * 1.3, 0.3]}>
      <dodecahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial color={STONE_DARK} roughness={1} transparent />
    </mesh>
  );
}

function TopPiece({
  builtAmount,
  yTarget,
  args,
  color = STONE,
}: {
  builtAmount: number;
  yTarget: number;
  args: [number, number, number];
  color?: string;
}) {
  const eased = useEased(builtAmount, 5);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const v = eased.current;
    ref.current.position.y = yTarget + (1 - v) * 1.2;
    ref.current.visible = v > 0.02;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.transparent = true;
    m.opacity = v;
  });
  return (
    <mesh ref={ref} position={[0, yTarget, 0]} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Pediment({ builtAmount, yTarget }: { builtAmount: number; yTarget: number }) {
  const eased = useEased(builtAmount, 5);
  const ref = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.95, 0);
    shape.lineTo(1.95, 0);
    shape.lineTo(0, 0.7);
    shape.lineTo(-1.95, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.9, bevelEnabled: false });
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    const v = eased.current;
    ref.current.position.y = yTarget + (1 - v) * 1.4;
    ref.current.visible = v > 0.02;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.transparent = true;
    m.opacity = v;
  });
  return (
    <mesh ref={ref} geometry={geom} position={[0, yTarget, -0.45]} castShadow>
      <meshStandardMaterial color={STONE} roughness={0.8} />
    </mesh>
  );
}

function Scene({ value }: { value: number }) {
  const positions = useMemo(() => [-2.0, -1.2, -0.4, 0.4, 1.2, 2.0], []);
  // Distribute progress: 6 columns first, then architrave, then pediment
  const stage = value * STAGES; // 0..8

  const columnAmounts = positions.map((_, i) => {
    return THREE.MathUtils.clamp(stage - i, 0, 1);
  });
  const architraveAmount = THREE.MathUtils.clamp(stage - 6, 0, 1);
  const pedimentAmount = THREE.MathUtils.clamp(stage - 7, 0, 1);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;
  });

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      {/* sòl / estilòbat */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 1.6]} />
        <meshStandardMaterial color={STONE_DARK} roughness={1} />
      </mesh>
      <mesh position={[0, 0.13, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.06, 1.4]} />
        <meshStandardMaterial color={STONE} roughness={0.95} />
      </mesh>

      {/* ombra falsa */}
      <mesh position={[0, -0.099, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>

      {/* runes que desapareixen */}
      {positions.map((x, i) => (
        <Rubble key={`r-${i}`} x={x} hide={columnAmounts[i]} />
      ))}

      {/* columnes */}
      {positions.map((x, i) => (
        <Column key={`c-${i}`} x={x} builtAmount={columnAmounts[i]} />
      ))}

      {/* arquitrau */}
      <TopPiece
        builtAmount={architraveAmount}
        yTarget={1.95}
        args={[4.4, 0.28, 0.9]}
      />

      {/* frontó */}
      <Pediment builtAmount={pedimentAmount} yTarget={2.12} />
    </group>
  );
}

export function TempleProgress({ value, className }: Props) {
  const complete = value >= 0.999;
  return (
    <div className={className} style={{ width: "100%", height: 220 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.6, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={complete ? 1.6 : 1.1}
          color={complete ? SUNSET : "#ffd9b0"}
        />
        <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#9b6b9e" />
        <Suspense fallback={null}>
          <Scene value={value} />
        </Suspense>
      </Canvas>
    </div>
  );
}
