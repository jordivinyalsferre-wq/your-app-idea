import { type Pillar, PILLAR_ORDER } from "@/data/practices";

type Counts = Record<Pillar, number>;

// Isometric projection
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const U = 16; // unit in px
const VB_W = 420;
const VB_H = 340;
// Centre approx: 5 columns spanning slot 0..4 (×1.6) -> x ranges roughly [-0.4, 5.0], yMid ~ 0
// Pick origin so the iso projection lands centred.
const ORIGIN_X = VB_W / 2 - 8;
const ORIGIN_Y = VB_H * 0.62;

function iso(x: number, y: number, z: number) {
  // Centre around the temple midpoint
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

const STONE_TOP = "var(--temple-stone-light)";
const STONE_LEFT = "var(--temple-stone-mid)";
const STONE_RIGHT = "var(--temple-stone-shadow)";
const SAND = "var(--temple-sand)";
const SAND_DEEP = "var(--temple-sand-deep)";
const GHOST = "var(--temple-stone-shadow)";

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
  ghost,
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
      <g className={className} style={style} opacity={0.1}>
        <polygon
          points={`${pt(A2)} ${pt(B2)} ${pt(C2)} ${pt(D2)}`}
          fill="none"
          stroke={GHOST}
          strokeWidth={0.6}
        />
        <polygon
          points={`${pt(D)} ${pt(C)} ${pt(C2)} ${pt(D2)}`}
          fill="none"
          stroke={GHOST}
          strokeWidth={0.6}
        />
        <polygon
          points={`${pt(B)} ${pt(C)} ${pt(C2)} ${pt(B2)}`}
          fill="none"
          stroke={GHOST}
          strokeWidth={0.6}
        />
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

const COL_W = 1.0;
const COL_D = 1.0;
const DRUM_H = 0.55;
const BASE_Z = 0.6;

function columnPos(slot: number) {
  return { cx: slot * 1.6 + 0.2, cy: -0.5 };
}

function Column({ slot, drums }: { slot: number; drums: number }) {
  const { cx, cy } = columnPos(slot);
  const placed = Math.min(drums, 5);
  const showCapital = drums >= 5;

  return (
    <g>
      {/* Ghost full column (always) */}
      {Array.from({ length: 5 }).map((_, i) =>
        i < placed ? null : (
          <Cuboid
            key={`g-${slot}-${i}`}
            x={cx}
            y={cy}
            z={BASE_Z + i * DRUM_H}
            w={COL_W}
            d={COL_D}
            h={DRUM_H}
            ghost
          />
        ),
      )}
      {!showCapital && (
        <Cuboid
          x={cx - 0.1}
          y={cy - 0.1}
          z={BASE_Z + 5 * DRUM_H}
          w={COL_W + 0.2}
          d={COL_D + 0.2}
          h={0.3}
          ghost
        />
      )}

      {/* Real placed drums */}
      {Array.from({ length: placed }).map((_, i) => (
        <Cuboid
          key={`d-${slot}-${i}`}
          x={cx}
          y={cy}
          z={BASE_Z + i * DRUM_H}
          w={COL_W}
          d={COL_D}
          h={DRUM_H}
          className="temple-piece-in"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
      {showCapital && (
        <Cuboid
          x={cx - 0.1}
          y={cy - 0.1}
          z={BASE_Z + placed * DRUM_H}
          w={COL_W + 0.2}
          d={COL_D + 0.2}
          h={0.3}
          className="temple-piece-in"
          style={{ animationDelay: `${placed * 60}ms` }}
        />
      )}
    </g>
  );
}

export function TempleScene({ counts, hestia }: { counts: Counts; hestia: boolean }) {
  const allFive = PILLAR_ORDER.every((p) => counts[p] >= 5);
  const allSeven = PILLAR_ORDER.every((p) => counts[p] >= 7);
  const allTen = PILLAR_ORDER.every((p) => counts[p] >= 10);

  const styloX = -0.4;
  const styloY = -1.2;
  const styloW = 5 * 1.6 - 0.6 + 1.0;
  const styloD = 2.2;

  const totalProgress = PILLAR_ORDER.reduce((s, p) => s + Math.min(counts[p], 5), 0);
  const scattered = [
    { x: -1.2, y: 1.6, w: 0.7, d: 0.7, h: 0.4 },
    { x: 6.4, y: 1.2, w: 0.8, d: 0.8, h: 0.4 },
    { x: 6.9, y: -0.4, w: 0.6, d: 0.6, h: 0.3 },
  ];
  const scatteredVisible = Math.max(0, scattered.length - Math.floor(totalProgress / 4));

  // Architrave geometry
  const archX = styloX + 0.05;
  const archY = -0.7;
  const archW = styloW - 0.1;
  const archD = 1.2;
  const archZ = BASE_Z + 5 * DRUM_H + 0.3;
  const archH = 0.45;

  // Pediment apex
  const pedBaseZ = archZ + archH;
  const xL = archX;
  const xR = archX + archW;
  const xMid = (xL + xR) / 2;
  const yF = archY;
  const yB = archY + archD;
  const apexZ = pedBaseZ + 1.6;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="w-full h-full block"
      preserveAspectRatio="xMidYMid meet"
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

      <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#sky)" />
      <circle cx={VB_W - 80} cy="60" r="22" fill="url(#moon)" />
      <circle cx={VB_W - 80} cy="60" r="9" fill="var(--temple-stone-light)" opacity="0.55" />

      <polygon
        points={`0,225 60,165 110,195 170,145 230,185 290,155 360,190 ${VB_W},175 ${VB_W},250 0,250`}
        fill="var(--temple-mountain)"
        opacity="0.85"
      />
      <polygon
        points={`0,245 80,205 150,230 220,200 300,225 ${VB_W},210 ${VB_W},280 0,280`}
        fill="var(--temple-mountain)"
        opacity="0.55"
      />

      <rect x="0" y={VB_H * 0.72} width={VB_W} height={VB_H * 0.28} fill={SAND} />
      <rect x="0" y={VB_H * 0.85} width={VB_W} height={VB_H * 0.15} fill={SAND_DEEP} />

      {/* Stylobate (3-step base) */}
      <Cuboid
        x={styloX - 0.3}
        y={styloY - 0.3}
        z={-0.6}
        w={styloW + 0.6}
        d={styloD + 0.6}
        h={0.2}
        top={SAND}
        left={SAND_DEEP}
        right={SAND_DEEP}
      />
      <Cuboid x={styloX - 0.15} y={styloY - 0.15} z={-0.4} w={styloW + 0.3} d={styloD + 0.3} h={0.2} />
      <Cuboid x={styloX} y={styloY} z={-0.2} w={styloW} d={styloD} h={0.4} />

      {/* Scattered ruin drums */}
      {scattered.slice(0, scatteredVisible).map((r, i) => (
        <Cuboid
          key={`s-${i}`}
          x={r.x}
          y={r.y}
          z={-0.55}
          w={r.w}
          d={r.d}
          h={r.h}
          top={STONE_LEFT}
          left={STONE_RIGHT}
          right={SAND_DEEP}
        />
      ))}

      {/* Five columns */}
      {PILLAR_ORDER.map((id, slot) => (
        <Column key={id} slot={slot} drums={counts[id]} />
      ))}

      {/* Architrave ghost */}
      {!allFive && (
        <Cuboid x={archX} y={archY} z={archZ} w={archW} d={archD} h={archH} ghost />
      )}
      {allFive && (
        <Cuboid
          x={archX}
          y={archY}
          z={archZ}
          w={archW}
          d={archD}
          h={archH}
          className="temple-piece-in"
        />
      )}

      {/* Pediment ghost / real */}
      {(() => {
        const FL = iso(xL, yF, pedBaseZ);
        const FR = iso(xR, yF, pedBaseZ);
        const FA = iso(xMid, yF, apexZ);
        const BL = iso(xL, yB, pedBaseZ);
        const BR = iso(xR, yB, pedBaseZ);
        const BA = iso(xMid, yB, apexZ);

        if (!allSeven) {
          return (
            <g opacity={0.1}>
              <polygon
                points={`${pt(FL)} ${pt(FR)} ${pt(FA)}`}
                fill="none"
                stroke={GHOST}
                strokeWidth={0.6}
              />
              <polygon
                points={`${pt(FR)} ${pt(BR)} ${pt(BA)} ${pt(FA)}`}
                fill="none"
                stroke={GHOST}
                strokeWidth={0.6}
              />
            </g>
          );
        }

        return (
          <g className="temple-piece-in" style={{ animationDelay: "200ms" }}>
            <polygon points={`${pt(BL)} ${pt(BR)} ${pt(BA)}`} fill={STONE_RIGHT} />
            <polygon points={`${pt(FR)} ${pt(BR)} ${pt(BA)} ${pt(FA)}`} fill={STONE_LEFT} />
            <polygon points={`${pt(FL)} ${pt(BL)} ${pt(BA)} ${pt(FA)}`} fill={STONE_TOP} />
            <polygon points={`${pt(FL)} ${pt(FR)} ${pt(FA)}`} fill={STONE_TOP} opacity="0.95" />

            {hestia &&
              (() => {
                const flameBase = iso(xMid, yF - 0.05, pedBaseZ + 0.5);
                return (
                  <g>
                    <circle cx={flameBase.x} cy={flameBase.y} r="9" fill="var(--temple-amber)" opacity="0.25" />
                    <circle cx={flameBase.x} cy={flameBase.y} r="4.5" fill="var(--temple-amber)" />
                    <circle
                      cx={flameBase.x}
                      cy={flameBase.y - 2}
                      r="2"
                      fill="var(--temple-stone-light)"
                      opacity="0.9"
                    />
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
