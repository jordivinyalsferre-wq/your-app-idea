import { type Pillar, PILLAR_ORDER } from "@/data/practices";

type Counts = Record<Pillar, number>;

/* ── Isometric engine ── */
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const U = 16;
const VB_W = 420;
const VB_H = 360;
const ORIGIN_X = VB_W / 2 - 8;
const ORIGIN_Y = VB_H * 0.58;

function iso(x: number, y: number, z: number) {
  const cx = x - 3.6;
  const cy = y + 0.1;
  return {
    x: ORIGIN_X + (cx - cy) * COS * U,
    y: ORIGIN_Y + ((cx + cy) * SIN - z) * U,
  };
}

function pt(p: { x: number; y: number }) {
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}

/* ── Monument Valley palette ── */
const STONE_TOP = "oklch(0.92 0.015 80)";
const STONE_LEFT = "oklch(0.78 0.02 75)";
const STONE_RIGHT = "oklch(0.60 0.03 300)";
const GHOST_STROKE = "oklch(0.55 0.03 300 / 0.12)";

/* ── Vegetation colors ── */
const VINE_COLOR = "oklch(0.55 0.12 145 / 0.5)";
const MOSS_COLOR = "oklch(0.48 0.1 140 / 0.35)";

/* ── Cuboid ── */
function Cuboid({
  x, y, z, w, d, h,
  top = STONE_TOP, left = STONE_LEFT, right = STONE_RIGHT,
  className, style, ghost,
}: {
  x: number; y: number; z: number;
  w: number; d: number; h: number;
  top?: string; left?: string; right?: string;
  className?: string; style?: React.CSSProperties;
  ghost?: boolean;
}) {
  const A = iso(x, y, z);
  const B = iso(x + w, y, z);
  const C = iso(x + w, y + d, z);
  const D = iso(x, y + d, z);
  const A2 = iso(x, y, z + h);
  const B2 = iso(x + w, y, z + h);
  const C2 = iso(x + w, y + d, z + h);
  const D2 = iso(x, y + d, z + h);

  if (ghost) {
    return (
      <g className={className} style={style} opacity={0.08}>
        <polygon points={`${pt(A2)} ${pt(B2)} ${pt(C2)} ${pt(D2)}`} fill="none" stroke={GHOST_STROKE} strokeWidth={0.5} />
        <polygon points={`${pt(D)} ${pt(C)} ${pt(C2)} ${pt(D2)}`} fill="none" stroke={GHOST_STROKE} strokeWidth={0.5} />
        <polygon points={`${pt(B)} ${pt(C)} ${pt(C2)} ${pt(B2)}`} fill="none" stroke={GHOST_STROKE} strokeWidth={0.5} />
      </g>
    );
  }

  return (
    <g className={className} style={style}>
      <polygon points={`${pt(D)} ${pt(C)} ${pt(C2)} ${pt(D2)}`} fill={left} />
      <polygon points={`${pt(B)} ${pt(C)} ${pt(C2)} ${pt(B2)}`} fill={right} />
      <polygon points={`${pt(A2)} ${pt(B2)} ${pt(C2)} ${pt(D2)}`} fill={top} />
    </g>
  );
}

/* ── Column geometry ── */
const COL_W = 1.0;
const COL_D = 1.0;
const DRUM_H = 0.55;
const BASE_Z = 0.6;

function columnPos(slot: number) {
  return { cx: slot * 1.6 + 0.2, cy: -0.5 };
}

/* ── Vegetation patches ── */
function VegetationPatch({ x, y, z, progress }: { x: number; y: number; z: number; progress: number }) {
  if (progress >= 3) return null; // vegetation disappears as temple is built
  const p = iso(x, y, z);
  const opacity = Math.max(0, 1 - progress / 3);
  return (
    <g opacity={opacity}>
      {/* Small grass tufts */}
      <ellipse cx={p.x} cy={p.y} rx={5} ry={2.5} fill={MOSS_COLOR} />
      <ellipse cx={p.x + 3} cy={p.y - 1} rx={3} ry={1.5} fill={VINE_COLOR} />
      <ellipse cx={p.x - 4} cy={p.y + 1} rx={4} ry={2} fill={VINE_COLOR} />
    </g>
  );
}

/* ── Water puddle ── */
function WaterPuddle({ x, y, z, progress }: { x: number; y: number; z: number; progress: number }) {
  if (progress >= 5) return null;
  const p = iso(x, y, z);
  const opacity = Math.max(0, (1 - progress / 5) * 0.4);
  return (
    <g opacity={opacity}>
      <ellipse cx={p.x} cy={p.y} rx={12} ry={5} fill="oklch(0.55 0.1 230)" />
      <ellipse cx={p.x} cy={p.y - 0.5} rx={8} ry={3} fill="oklch(0.65 0.08 220 / 0.5)" />
    </g>
  );
}

function Column({ slot, drums }: { slot: number; drums: number }) {
  const { cx, cy } = columnPos(slot);
  const placed = Math.min(drums, 5);
  const showCapital = drums >= 5;

  return (
    <g>
      {/* Ghost drums */}
      {Array.from({ length: 5 }).map((_, i) =>
        i < placed ? null : (
          <Cuboid key={`g-${slot}-${i}`} x={cx} y={cy} z={BASE_Z + i * DRUM_H} w={COL_W} d={COL_D} h={DRUM_H} ghost />
        ),
      )}
      {!showCapital && (
        <Cuboid x={cx - 0.1} y={cy - 0.1} z={BASE_Z + 5 * DRUM_H} w={COL_W + 0.2} d={COL_D + 0.2} h={0.3} ghost />
      )}

      {/* Real drums */}
      {Array.from({ length: placed }).map((_, i) => (
        <Cuboid
          key={`d-${slot}-${i}`}
          x={cx} y={cy} z={BASE_Z + i * DRUM_H}
          w={COL_W} d={COL_D} h={DRUM_H}
          className="temple-piece-in"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
      {showCapital && (
        <Cuboid
          x={cx - 0.1} y={cy - 0.1} z={BASE_Z + placed * DRUM_H}
          w={COL_W + 0.2} d={COL_D + 0.2} h={0.3}
          className="temple-piece-in"
          style={{ animationDelay: `${placed * 80}ms` }}
        />
      )}
    </g>
  );
}

/* ── Main scene ── */
export function TempleScene({ counts, hestia }: { counts: Counts; hestia: boolean }) {
  const allFive = PILLAR_ORDER.every((p) => counts[p] >= 5);
  const allSeven = PILLAR_ORDER.every((p) => counts[p] >= 7);
  const allTen = PILLAR_ORDER.every((p) => counts[p] >= 10);

  const styloX = -0.4;
  const styloY = -1.2;
  const styloW = 5 * 1.6 - 0.6 + 1.0;
  const styloD = 2.2;

  const totalProgress = PILLAR_ORDER.reduce((s, p) => s + Math.min(counts[p], 5), 0);

  // Scattered ruin drums — fewer as progress grows
  const scattered = [
    { x: -1.4, y: 1.8, w: 0.7, d: 0.7, h: 0.35 },
    { x: 6.6, y: 1.4, w: 0.65, d: 0.65, h: 0.3 },
    { x: 7.2, y: -0.6, w: 0.5, d: 0.5, h: 0.25 },
  ];
  const scatteredVisible = Math.max(0, scattered.length - Math.floor(totalProgress / 4));

  // Architrave
  const archX = styloX + 0.05;
  const archY = -0.7;
  const archW = styloW - 0.1;
  const archD = 1.2;
  const archZ = BASE_Z + 5 * DRUM_H + 0.3;
  const archH = 0.45;

  // Pediment
  const pedBaseZ = archZ + archH;
  const xL = archX;
  const xR = archX + archW;
  const xMid = (xL + xR) / 2;
  const yF = archY;
  const yB = archY + archD;
  const apexZ = pedBaseZ + 1.6;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Floating shadow beneath temple */}
        <radialGradient id="float-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0 0 0 / 0.2)" />
          <stop offset="100%" stopColor="oklch(0 0 0 / 0)" />
        </radialGradient>
        {/* Subtle ambient glow */}
        <radialGradient id="ambient-glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="oklch(0.74 0.18 42 / 0.06)" />
          <stop offset="100%" stopColor="oklch(0.74 0.18 42 / 0)" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind temple */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#ambient-glow)" />

      {/* Floating shadow ellipse beneath stylobate */}
      {(() => {
        const shadowCenter = iso(styloX + styloW / 2, styloY + styloD / 2, -1.5);
        return (
          <ellipse
            cx={shadowCenter.x}
            cy={shadowCenter.y + 12}
            rx={120}
            ry={25}
            fill="url(#float-shadow)"
          />
        );
      })()}

      {/* Water puddles — disappear with progress */}
      <WaterPuddle x={-0.8} y={1.0} z={-0.3} progress={totalProgress} />
      <WaterPuddle x={6.0} y={0.5} z={-0.3} progress={totalProgress} />

      {/* Vegetation — disappears as temple builds */}
      <VegetationPatch x={-1.0} y={0.5} z={-0.2} progress={totalProgress} />
      <VegetationPatch x={5.8} y={-0.8} z={-0.2} progress={totalProgress} />
      <VegetationPatch x={3.0} y={1.5} z={-0.2} progress={totalProgress} />
      <VegetationPatch x={7.0} y={0.2} z={-0.2} progress={totalProgress} />

      {/* Stylobate — floating base */}
      <Cuboid
        x={styloX - 0.15} y={styloY - 0.15} z={-0.2}
        w={styloW + 0.3} d={styloD + 0.3} h={0.2}
        top="oklch(0.82 0.015 75)" left="oklch(0.68 0.02 70)" right="oklch(0.50 0.03 300)"
      />
      <Cuboid x={styloX} y={styloY} z={0} w={styloW} d={styloD} h={0.4} />

      {/* Scattered drums */}
      {scattered.slice(0, scatteredVisible).map((r, i) => (
        <Cuboid
          key={`s-${i}`}
          x={r.x} y={r.y} z={-0.15}
          w={r.w} d={r.d} h={r.h}
          top={STONE_LEFT} left={STONE_RIGHT} right="oklch(0.50 0.03 300)"
        />
      ))}

      {/* Five columns */}
      {PILLAR_ORDER.map((id, slot) => (
        <Column key={id} slot={slot} drums={counts[id]} />
      ))}

      {/* Architrave */}
      {!allFive && (
        <Cuboid x={archX} y={archY} z={archZ} w={archW} d={archD} h={archH} ghost />
      )}
      {allFive && (
        <Cuboid x={archX} y={archY} z={archZ} w={archW} d={archD} h={archH} className="temple-piece-in" />
      )}

      {/* Pediment */}
      {(() => {
        const FL = iso(xL, yF, pedBaseZ);
        const FR = iso(xR, yF, pedBaseZ);
        const FA = iso(xMid, yF, apexZ);
        const BL = iso(xL, yB, pedBaseZ);
        const BR = iso(xR, yB, pedBaseZ);
        const BA = iso(xMid, yB, apexZ);

        if (!allSeven) {
          return (
            <g opacity={0.08}>
              <polygon points={`${pt(FL)} ${pt(FR)} ${pt(FA)}`} fill="none" stroke={GHOST_STROKE} strokeWidth={0.5} />
              <polygon points={`${pt(FR)} ${pt(BR)} ${pt(BA)} ${pt(FA)}`} fill="none" stroke={GHOST_STROKE} strokeWidth={0.5} />
            </g>
          );
        }

        return (
          <g className="temple-piece-in" style={{ animationDelay: "200ms" }}>
            <polygon points={`${pt(BL)} ${pt(BR)} ${pt(BA)}`} fill={STONE_RIGHT} />
            <polygon points={`${pt(FR)} ${pt(BR)} ${pt(BA)} ${pt(FA)}`} fill={STONE_LEFT} />
            <polygon points={`${pt(FL)} ${pt(BL)} ${pt(BA)} ${pt(FA)}`} fill={STONE_TOP} />
            <polygon points={`${pt(FL)} ${pt(FR)} ${pt(FA)}`} fill={STONE_TOP} opacity="0.95" />

            {/* Hestia flame */}
            {hestia &&
              (() => {
                const flameBase = iso(xMid, yF - 0.05, pedBaseZ + 0.5);
                return (
                  <g>
                    <circle cx={flameBase.x} cy={flameBase.y} r="10" fill="oklch(0.82 0.16 70 / 0.2)" />
                    <circle cx={flameBase.x} cy={flameBase.y} r="5" fill="oklch(0.82 0.16 70)" />
                    <circle cx={flameBase.x} cy={flameBase.y - 2.5} r="2" fill="oklch(0.95 0.05 80)" opacity="0.9" />
                  </g>
                );
              })()}
          </g>
        );
      })()}

      {/* Acroteria */}
      {allTen && (
        <g className="temple-piece-in" style={{ animationDelay: "400ms" }}>
          <Cuboid x={xL - 0.15} y={-0.1 - 0.15} z={pedBaseZ} w={0.3} d={0.3} h={0.5} />
          <Cuboid x={xR - 0.15} y={-0.1 - 0.15} z={pedBaseZ} w={0.3} d={0.3} h={0.5} />
        </g>
      )}
    </svg>
  );
}
