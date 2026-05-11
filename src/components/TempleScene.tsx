import { type Pillar, PILLAR_ORDER } from "@/data/practices";

type Counts = Record<Pillar, number>;

// Isometric projection
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const U = 14; // unit in px
const ORIGIN_X = 200;
const ORIGIN_Y = 215;

function iso(x: number, y: number, z: number) {
  return {
    x: ORIGIN_X + (x - y) * COS * U,
    y: ORIGIN_Y + ((x + y) * SIN - z) * U,
  };
}

function pt(p: { x: number; y: number }) {
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}

const STONE_TOP = "var(--temple-stone-light)";
const STONE_LEFT = "var(--temple-stone-mid)";
const STONE_RIGHT = "var(--temple-stone-shadow)";
const SAND = "var(--temple-sand)";
const SAND_DEEP = "var(--temple-sand-deep)";

function Cuboid({
  x,
  y,
  z,
  w,
  d,
  h,
  top = STONE_TOP,
  left = STONE_LEFT,
  right = STONE_RIGHT,
  className,
  style,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top?: string;
  left?: string;
  right?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  // 8 corners
  const A = iso(x, y, z);
  const B = iso(x + w, y, z);
  const C = iso(x + w, y + d, z);
  const D = iso(x, y + d, z);
  const A2 = iso(x, y, z + h);
  const B2 = iso(x + w, y, z + h);
  const C2 = iso(x + w, y + d, z + h);
  const D2 = iso(x, y + d, z + h);

  // Visible: top (A2 B2 C2 D2), right face (+x): B,C,C2,B2 (darker), left face (+y): D,C,C2,D2 (lighter)
  return (
    <g className={className} style={style}>
      <polygon points={`${pt(D)} ${pt(C)} ${pt(C2)} ${pt(D2)}`} fill={left} />
      <polygon points={`${pt(B)} ${pt(C)} ${pt(C2)} ${pt(B2)}`} fill={right} />
      <polygon points={`${pt(A2)} ${pt(B2)} ${pt(C2)} ${pt(D2)}`} fill={top} />
    </g>
  );
}

// One column at logical slot 0..4 (x position), made of N cuboid drums + capital when >=5
function Column({ slot, drums }: { slot: number; drums: number }) {
  // Column footprint in iso units
  const w = 1.0;
  const d = 1.0;
  const drumH = 0.55;
  const baseZ = 0.6; // top of stylobate
  const cx = slot * 1.6 + 0.2;
  const cy = -0.5;

  const placed = Math.min(drums, 5);
  const showCapital = drums >= 5;

  return (
    <g>
      {Array.from({ length: placed }).map((_, i) => (
        <Cuboid
          key={`d-${slot}-${i}`}
          x={cx}
          y={cy}
          z={baseZ + i * drumH}
          w={w}
          d={d}
          h={drumH}
          className="temple-piece-in"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
      {showCapital && (
        <Cuboid
          key={`cap-${slot}`}
          x={cx - 0.1}
          y={cy - 0.1}
          z={baseZ + placed * drumH}
          w={w + 0.2}
          d={d + 0.2}
          h={0.3}
          className="temple-piece-in"
          style={{ animationDelay: `${placed * 60}ms` }}
        />
      )}
      {drums === 0 && (
        // ruin: half-buried single drum at base, slightly tilted feel via lower z
        <Cuboid
          x={cx + 0.05}
          y={cy + 0.05}
          z={baseZ - 0.35}
          w={w - 0.1}
          d={d - 0.1}
          h={0.35}
          top={STONE_LEFT}
          left={STONE_RIGHT}
          right={SAND_DEEP}
        />
      )}
    </g>
  );
}

export function TempleScene({ counts, hestia }: { counts: Counts; hestia: boolean }) {
  const allFive = PILLAR_ORDER.every((p) => counts[p] >= 5);
  const allSeven = PILLAR_ORDER.every((p) => counts[p] >= 7);
  const allTen = PILLAR_ORDER.every((p) => counts[p] >= 10);

  // Stylobate footprint
  const styloX = -0.4;
  const styloY = -1.2;
  const styloW = 5 * 1.6 - 0.6 + 1.0;
  const styloD = 2.2;

  // scattered ruin drums (visible only when overall progress is low)
  const totalProgress = PILLAR_ORDER.reduce((s, p) => s + Math.min(counts[p], 5), 0);
  const scattered = [
    { x: -0.9, y: 1.4, w: 0.7, d: 0.7, h: 0.4 },
    { x: 6.5, y: 1.0, w: 0.8, d: 0.8, h: 0.4 },
    { x: 7.0, y: -0.5, w: 0.6, d: 0.6, h: 0.3 },
    { x: -1.3, y: -0.2, w: 0.6, d: 0.6, h: 0.35 },
    { x: 3.5, y: 2.0, w: 0.9, d: 0.9, h: 0.4 },
  ];
  const scatteredVisible = Math.max(0, scattered.length - Math.floor(totalProgress / 3));

  // fallen column (foreground horizontal) — visible only at very start
  const fallenVisible = totalProgress < 4;

  return (
    <svg
      viewBox="0 0 400 320"
      className="w-full h-full block"
      preserveAspectRatio="xMidYMid meet"
      style={{ background: "transparent" }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--temple-sky-1)" />
          <stop offset="100%" stopColor="var(--temple-sky-2)" />
        </linearGradient>
        <radialGradient id="moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--temple-stone-light)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--temple-stone-light)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="400" height="320" fill="url(#sky)" />
      {/* moon */}
      <circle cx="320" cy="70" r="22" fill="url(#moon)" />
      <circle cx="320" cy="70" r="9" fill="var(--temple-stone-light)" opacity="0.55" />

      {/* distant mountains */}
      <polygon points="0,210 60,150 110,180 170,130 230,170 290,140 360,175 400,160 400,230 0,230"
        fill="var(--temple-mountain)" opacity="0.85" />
      <polygon points="0,225 80,185 150,210 220,180 300,205 400,190 400,260 0,260"
        fill="var(--temple-mountain)" opacity="0.55" />

      {/* sand ground */}
      <rect x="0" y="225" width="400" height="95" fill={SAND} />
      <rect x="0" y="265" width="400" height="55" fill={SAND_DEEP} />

      {/* stylobate (3-step base) */}
      <Cuboid x={styloX - 0.3} y={styloY - 0.3} z={-0.6} w={styloW + 0.6} d={styloD + 0.6} h={0.2} top={SAND} left={SAND_DEEP} right={SAND_DEEP} />
      <Cuboid x={styloX - 0.15} y={styloY - 0.15} z={-0.4} w={styloW + 0.3} d={styloD + 0.3} h={0.2} />
      <Cuboid x={styloX} y={styloY} z={-0.2} w={styloW} d={styloD} h={0.4} />

      {/* scattered ruin drums on the sand */}
      {scattered.slice(0, scatteredVisible).map((r, i) => (
        <Cuboid key={`s-${i}`} x={r.x} y={r.y} z={-0.6 + 0.05} w={r.w} d={r.d} h={r.h}
          top={STONE_LEFT} left={STONE_RIGHT} right={SAND_DEEP} />
      ))}

      {/* fallen horizontal column (3 drums lying down) */}
      {fallenVisible && (
        <g style={{ opacity: 0.95 }}>
          <Cuboid x={2.5} y={1.6} z={-0.55} w={1.6} d={0.5} h={0.5} top={STONE_LEFT} left={STONE_RIGHT} right={SAND_DEEP} />
          <Cuboid x={4.2} y={1.6} z={-0.55} w={1.4} d={0.5} h={0.5} top={STONE_LEFT} left={STONE_RIGHT} right={SAND_DEEP} />
        </g>
      )}

      {/* Five columns — one per pillar */}
      {PILLAR_ORDER.map((id, slot) => (
        <Column key={id} slot={slot} drums={counts[id]} />
      ))}

      {/* Architrave (horizontal beam) when all >= 5 */}
      {allFive && (
        <Cuboid
          x={styloX + 0.05}
          y={-0.7}
          z={0.6 + 5 * 0.55 + 0.3}
          w={styloW - 0.1}
          d={1.2}
          h={0.45}
          className="temple-piece-in"
        />
      )}

      {/* Pediment (triangular roof) when all >= 7 */}
      {allSeven && (() => {
        const baseZ = 0.6 + 5 * 0.55 + 0.3 + 0.45;
        const xL = styloX + 0.05;
        const xR = styloX + 0.05 + (styloW - 0.1);
        const yF = -0.7;
        const yB = -0.7 + 1.2;
        const xMid = (xL + xR) / 2;
        const apexZ = baseZ + 1.6;

        const FL = iso(xL, yF, baseZ);
        const FR = iso(xR, yF, baseZ);
        const FA = iso(xMid, yF, apexZ);
        const BL = iso(xL, yB, baseZ);
        const BR = iso(xR, yB, baseZ);
        const BA = iso(xMid, yB, apexZ);

        return (
          <g className="temple-piece-in" style={{ animationDelay: "200ms" }}>
            {/* back gable */}
            <polygon points={`${pt(BL)} ${pt(BR)} ${pt(BA)}`} fill={STONE_RIGHT} />
            {/* roof slope right */}
            <polygon points={`${pt(FR)} ${pt(BR)} ${pt(BA)} ${pt(FA)}`} fill={STONE_LEFT} />
            {/* roof slope left */}
            <polygon points={`${pt(FL)} ${pt(BL)} ${pt(BA)} ${pt(FA)}`} fill={STONE_TOP} />
            {/* front gable */}
            <polygon points={`${pt(FL)} ${pt(FR)} ${pt(FA)}`} fill={STONE_TOP} opacity="0.95" />

            {/* Hestia flame at front gable centre */}
            {hestia && (() => {
              const flameBase = iso(xMid, yF - 0.05, baseZ + 0.5);
              return (
                <g style={{ transition: "opacity 1.2s ease" }}>
                  <circle cx={flameBase.x} cy={flameBase.y} r="9" fill="var(--temple-amber)" opacity="0.25" />
                  <circle cx={flameBase.x} cy={flameBase.y} r="4.5" fill="var(--temple-amber)" />
                  <circle cx={flameBase.x} cy={flameBase.y - 2} r="2" fill="var(--temple-stone-light)" opacity="0.9" />
                </g>
              );
            })()}
          </g>
        );
      })()}

      {/* Acroteria — small finials at corners when all >= 10 */}
      {allTen && (() => {
        const baseZ = 0.6 + 5 * 0.55 + 0.3 + 0.45;
        const xL = styloX + 0.05;
        const xR = styloX + 0.05 + (styloW - 0.1);
        const yMid = -0.1;
        return (
          <g className="temple-piece-in" style={{ animationDelay: "400ms" }}>
            <Cuboid x={xL - 0.15} y={yMid - 0.15} z={baseZ} w={0.3} d={0.3} h={0.5} />
            <Cuboid x={xR - 0.15} y={yMid - 0.15} z={baseZ} w={0.3} d={0.3} h={0.5} />
          </g>
        );
      })()}
    </svg>
  );
}
