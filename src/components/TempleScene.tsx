import { type Pillar, PILLAR_ORDER } from "@/data/practices";
type Counts = Record<Pillar, number>;

/* ═══ ISO ENGINE ═══ */
const C30 = Math.cos(Math.PI / 6), S30 = 0.5, U = 17;
const VW = 440, VH = 440, OX = VW / 2, OY = VH * 0.50;
function iso(x: number, y: number, z: number) {
  return { x: OX + (x - y) * C30 * U, y: OY + ((x + y) * S30 - z) * U };
}
function pt(p: { x: number; y: number }) { return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }

/* ═══ PALETTE ═══ */
const P = {
  sT: "#E4DDD0", sL: "#C8B8A8", sR: "#9088A8",
  eT: "#7BAA80", eL: "#5C8868", eR: "#4A7070",
  rL: "#887868", rR: "#685858", rD: "#584848",
  tealT: "#88CCCC", tealL: "#60A8B0", tealR: "#5080A0",
  lavT: "#C8B8D8", lavL: "#A898C0", lavR: "#8878A8",
  w1: "#58A8B8", w2: "#78C8D8",
  trA: "#60A068", trB: "#508858", trC: "#407848", tk: "#907860",
  fA: "#E8A070", fB: "#D87888", fC: "#B888D0",
};

/* ═══ CUBOID WITH TEXTURE ═══ */
function Box({ x, y, z, w, d, h, top = P.sT, left = P.sL, right = P.sR,
  className, style, ghost, opacity: op }: {
  x: number; y: number; z: number; w: number; d: number; h: number;
  top?: string; left?: string; right?: string;
  className?: string; style?: React.CSSProperties; ghost?: boolean; opacity?: number;
}) {
  const a = iso(x, y, z + h), b = iso(x + w, y, z + h), c = iso(x + w, y + d, z + h),
    dd = iso(x, y + d, z + h), e = iso(x, y + d, z), f = iso(x + w, y + d, z), g = iso(x + w, y, z);
  if (ghost) return (
    <g opacity={0.07}>
      <polygon points={`${pt(a)} ${pt(b)} ${pt(c)} ${pt(dd)}`} fill="none" stroke="rgba(180,170,200,0.15)" strokeWidth={0.5} />
      <polygon points={`${pt(dd)} ${pt(e)} ${pt(f)} ${pt(c)}`} fill="none" stroke="rgba(180,170,200,0.15)" strokeWidth={0.5} />
      <polygon points={`${pt(b)} ${pt(g)} ${pt(f)} ${pt(c)}`} fill="none" stroke="rgba(180,170,200,0.15)" strokeWidth={0.5} />
    </g>
  );
  return (
    <g className={className} style={style} opacity={op}>
      {/* Main faces */}
      <polygon points={`${pt(dd)} ${pt(e)} ${pt(f)} ${pt(c)}`} fill={left} />
      <polygon points={`${pt(b)} ${pt(g)} ${pt(f)} ${pt(c)}`} fill={right} />
      <polygon points={`${pt(a)} ${pt(b)} ${pt(c)} ${pt(dd)}`} fill={top} />
      {/* Texture: subtle noise lines on top face */}
      <polygon points={`${pt(a)} ${pt(b)} ${pt(c)} ${pt(dd)}`} fill="url(#stoneGrain)" opacity={0.08} />
      {/* Edge highlights */}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.12)" strokeWidth={0.4} />
      <line x1={a.x} y1={a.y} x2={dd.x} y2={dd.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.3} />
    </g>
  );
}

/* ═══ FALLEN COLUMN (horizontal drum) ═══ */
function FallenColumn({ x, y, z, drums, rot = 0 }: { x: number; y: number; z: number; drums: number; rot?: number }) {
  // Drums lying flat — width becomes height, rendered along x-axis
  return <g>
    {Array.from({ length: drums }).map((_, i) => (
      <Box key={i}
        x={x + i * 0.48 * Math.cos(rot * Math.PI / 180)}
        y={y + i * 0.48 * Math.sin(rot * Math.PI / 180)}
        z={z}
        w={0.45} d={0.45} h={0.45}
        top={P.sL} left={P.sR} right="#706888"
      />
    ))}
  </g>;
}

/* ═══ TREE ═══ */
function Tree({ x, y, z, s = 1 }: { x: number; y: number; z: number; s?: number }) {
  return <g>
    <Box x={x} y={y} z={z} w={.12*s} d={.12*s} h={.5*s} top={P.tk} left={P.tk} right="#685848" />
    <Box x={x-.22*s} y={y-.22*s} z={z+.42*s} w={.58*s} d={.58*s} h={.4*s} top={P.trA} left={P.trC} right={P.trB} />
    <Box x={x-.14*s} y={y-.14*s} z={z+.78*s} w={.42*s} d={.42*s} h={.32*s} top={P.trB} left={P.trC} right={P.trA} />
    <Box x={x-.06*s} y={y-.06*s} z={z+1.06*s} w={.26*s} d={.26*s} h={.22*s} top={P.trA} left={P.trB} right={P.trC} />
  </g>;
}

/* ═══ ANIMATED WATERFALL ═══ */
function Waterfall({ x, y, z, h: wh }: { x: number; y: number; z: number; h: number }) {
  const t1 = iso(x, y, z), t2 = iso(x + .35, y, z);
  const b1 = iso(x, y, z - wh), b2 = iso(x + .35, y, z - wh);
  return <g>
    <polygon points={`${pt(t1)} ${pt(t2)} ${pt(b2)} ${pt(b1)}`} fill={P.w1} opacity={0.6} />
    {/* Animated shimmer lines */}
    <line x1={t1.x + 2} y1={t1.y} x2={b1.x + 2} y2={b1.y} stroke={P.w2} strokeWidth={1.5} opacity={0.3}>
      <animate attributeName="opacity" values="0.15;0.45;0.15" dur="2.5s" repeatCount="indefinite" />
    </line>
    <line x1={t1.x + 5} y1={t1.y} x2={b1.x + 5} y2={b1.y} stroke="rgba(200,240,248,0.4)" strokeWidth={0.8}>
      <animate attributeName="opacity" values="0.1;0.35;0.1" dur="3.2s" repeatCount="indefinite" />
    </line>
    {/* Splash at base */}
    <ellipse cx={(b1.x + b2.x) / 2} cy={b1.y + 4} rx={9} ry={3.5} fill="rgba(200,240,248,0.5)">
      <animate attributeName="rx" values="8;10;8" dur="2s" repeatCount="indefinite" />
    </ellipse>
  </g>;
}

/* ═══ COLUMN ═══ */
const CW = 0.85, CD = 0.85, DH = 0.48, BZ = 0.62;
function colPos(s: number) { return { cx: s * 1.45 + 0.55, cy: 0.25 }; }
function Column({ slot, drums }: { slot: number; drums: number }) {
  const { cx, cy } = colPos(slot);
  const placed = Math.min(drums, 5);
  const cap = drums >= 5;
  return <g>
    {Array.from({ length: 5 }).map((_, i) => i < placed ? null :
      <Box key={`g${i}`} x={cx} y={cy} z={BZ + i * DH} w={CW} d={CD} h={DH} ghost />)}
    {!cap && <Box x={cx - .07} y={cy - .07} z={BZ + 5 * DH} w={CW + .14} d={CD + .14} h={.22} ghost />}
    {Array.from({ length: placed }).map((_, i) =>
      <Box key={`d${i}`} x={cx} y={cy} z={BZ + i * DH} w={CW} d={CD} h={DH}
        className="temple-piece-in" style={{ animationDelay: `${i * 80}ms` }} />)}
    {cap && <Box x={cx - .07} y={cy - .07} z={BZ + placed * DH} w={CW + .14} d={CD + .14} h={.22}
      className="temple-piece-in" style={{ animationDelay: `${placed * 80}ms` }} />}
  </g>;
}

/* ═══ MAIN SCENE ═══ */
export function TempleScene({ counts, hestia, hour = 12 }: { counts: Counts; hestia: boolean; hour?: number }) {
  const a5 = PILLAR_ORDER.every(p => counts[p] >= 5);
  const a7 = PILLAR_ORDER.every(p => counts[p] >= 7);
  const a10 = PILLAR_ORDER.every(p => counts[p] >= 10);
  const total = PILLAR_ORDER.reduce((s, p) => s + Math.min(counts[p], 10), 0);
  const prog = total / 50;
  const natOp = Math.max(0.25, 1 - prog * 0.55);
  const isNight = hour >= 20 || hour < 7;
  const isDusk = hour >= 17 && hour < 20;

  // Island — rectangular
  const IX = -1.0, IY = -1.8, IW = 9.0, ID = 5.5;
  // Stylobate
  const SX = 0.1, SY = -0.2, SW = 5 * 1.45 + 0.9, SD = 1.9;
  // Architrave
  const aZ = BZ + 5 * DH + 0.22, aH = 0.38;
  // Pediment
  const pZ = aZ + aH;
  const xL = SX + .05, xR = SX + SW - .05, xM = (xL + xR) / 2;
  const yF = SY + .12, yB = SY + SD - .5;
  const apex = pZ + 1.3;

  // How many fallen columns visible (fewer as progress grows)
  const fallenVis = Math.max(0, 3 - Math.floor(total / 8));

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Stone grain texture */}
        <pattern id="stoneGrain" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="transparent" />
          <line x1="0" y1="2" x2="8" y2="3" stroke="rgba(0,0,0,0.15)" strokeWidth="0.3" />
          <line x1="0" y1="5" x2="6" y2="6" stroke="rgba(0,0,0,0.1)" strokeWidth="0.2" />
          <line x1="2" y1="7" x2="8" y2="7.5" stroke="rgba(0,0,0,0.08)" strokeWidth="0.2" />
          <circle cx="3" cy="4" r="0.4" fill="rgba(0,0,0,0.06)" />
          <circle cx="6" cy="1" r="0.3" fill="rgba(0,0,0,0.05)" />
        </pattern>
        <radialGradient id="fshadow" cx=".5" cy=".5" r=".5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ── Moon/Sun based on hour ── */}
      {isNight && <g opacity={0.4}>
        <circle cx={VW - 60} cy={50} r={26} fill="#E8E0F0" />
        <circle cx={VW - 48} cy={44} r={22} fill="#08060F" />
      </g>}
      {isDusk && <g opacity={0.5}>
        <circle cx={VW - 60} cy={70} r={18} fill="#F0C060" />
        <circle cx={VW - 60} cy={70} r={22} fill="rgba(240,180,80,0.15)" />
      </g>}
      {!isNight && !isDusk && <g opacity={0.25}>
        <circle cx={VW - 55} cy={45} r={16} fill="#F8F0D0" />
        <circle cx={VW - 55} cy={45} r={22} fill="rgba(248,240,200,0.1)" />
      </g>}

      {/* ── Stars (only at night/dusk) ── */}
      {(isNight || isDusk) && [[40, 30], [85, 65], [345, 22], [375, 78], [55, 115], [315, 48], [145, 18], [395, 108]].map(([cx, cy], i) => (
        <g key={i} opacity={isNight ? 0.35 : 0.15}>
          <line x1={cx - 2.5} y1={cy} x2={cx + 2.5} y2={cy} stroke="#D0C8E0" strokeWidth={0.5} />
          <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy + 2.5} stroke="#D0C8E0" strokeWidth={0.5} />
        </g>
      ))}

      {/* ── Floating shadow ── */}
      {(() => { const s = iso(IX + IW / 2, IY + ID / 2, -5); return <ellipse cx={s.x} cy={s.y + 18} rx={130} ry={28} fill="url(#fshadow)" />; })()}

      {/* ── ISLAND CLIFF — rectangular, layered ── */}
      <Box x={IX + .6} y={IY + .6} z={-3.8} w={IW - 1.2} d={ID - 1.2} h={1.0} top={P.rL} left={P.rD} right={P.rR} />
      <Box x={IX + .3} y={IY + .3} z={-2.8} w={IW - .6} d={ID - .6} h={.9} top={P.rL} left={P.rR} right={P.rD} />
      {/* Teal band */}
      <Box x={IX + .15} y={IY + .15} z={-1.9} w={IW - .3} d={ID - .3} h={.22} top={P.tealT} left={P.tealL} right={P.tealR} />
      <Box x={IX + .08} y={IY + .08} z={-1.68} w={IW - .16} d={ID - .16} h={.7} top={P.rL} left={P.rR} right={P.rD} />
      {/* Lavender band */}
      <Box x={IX} y={IY} z={-.98} w={IW} d={ID} h={.18} top={P.lavT} left={P.lavL} right={P.lavR} />
      <Box x={IX} y={IY} z={-.8} w={IW} d={ID} h={.65} top={P.eL} left={P.eR} right={P.rR} />

      {/* ── ISLAND SURFACE (grass) ── */}
      <Box x={IX} y={IY} z={-.15} w={IW} d={ID} h={.15} top={P.eT} left={P.eL} right={P.eR} />

      {/* ── WATERFALLS — cascading off sides ── */}
      <g opacity={natOp}>
        {/* Left side — two streams */}
        <Waterfall x={IX - .05} y={IY + 1.5} z={-.15} h={3.8} />
        <Waterfall x={IX - .05} y={IY + 2.5} z={-.3} h={3.0} />
        {/* Right side */}
        <Waterfall x={IX + IW - .3} y={IY + 3.0} z={-.2} h={2.8} />
      </g>

      {/* ── FALLEN COLUMNS (ruins on the ground) ── */}
      {fallenVis >= 1 && <FallenColumn x={-0.6} y={2.2} z={-0.1} drums={3} rot={15} />}
      {fallenVis >= 2 && <FallenColumn x={7.0} y={1.0} z={-0.1} drums={2} rot={-10} />}
      {fallenVis >= 3 && <FallenColumn x={6.8} y={3.2} z={-0.1} drums={2} rot={25} />}

      {/* ── TREES ── */}
      <g opacity={natOp}>
        <Tree x={IX + .4} y={IY + .6} z={0} s={1.1} />
        <Tree x={IX + 7.8} y={IY + 1.0} z={0} s={.85} />
        <Tree x={IX + .8} y={IY + 4.0} z={0} s={.7} />
        <Tree x={IX + 8.0} y={IY + 3.6} z={0} s={.95} />
        <Tree x={IX + 4.2} y={IY + 4.6} z={0} s={.6} />
      </g>

      {/* ── BUSHES ── */}
      <g opacity={natOp}>
        {[[2.0, 4.3], [6.5, .4], [1.4, 1.4], [5.8, 4.2], [3.5, 4.8]].map(([bx, by], i) => (
          <Box key={i} x={IX + bx} y={IY + by} z={0} w={.3} d={.3} h={.2} top={[P.trA, P.trB, P.trC][i % 3]} left={P.trC} right={P.trB} />
        ))}
      </g>

      {/* ── FLOWERS ── */}
      <g opacity={natOp}>
        {[[1.0, 3.0, P.fA], [7.0, 2.5, P.fB], [4.5, 4.5, P.fC], [2.2, .8, P.fA], [6.2, 4.6, P.fB]].map(([fx, fy, fc], i) => {
          const p = iso(IX + (fx as number), IY + (fy as number), .05);
          return <g key={i}><circle cx={p.x} cy={p.y} r={2} fill={fc as string} /><circle cx={p.x + 3} cy={p.y - 1} r={1.5} fill={P.fB} opacity={.6} /></g>;
        })}
      </g>

      {/* ── STYLOBATE ── */}
      <Box x={SX - .12} y={SY - .12} z={.03} w={SW + .24} d={SD + .24} h={.18} top="#DDD5C5" left="#B8A890" right="#807098" />
      <Box x={SX} y={SY} z={.15} w={SW} d={SD} h={.42} />
      {/* Decorative band */}
      <Box x={SX + .05} y={SY - .01} z={.52} w={SW - .1} d={.06} h={.05} top={P.lavT} left={P.lavL} right={P.lavR} />

      {/* ── COLUMNS ── */}
      {PILLAR_ORDER.map((id, s) => <Column key={id} slot={s} drums={counts[id]} />)}

      {/* ── ARCHITRAVE ── */}
      {!a5 ? <Box x={SX + .05} y={SY + .12} z={aZ} w={SW - .1} d={1.05} h={aH} ghost />
        : <Box x={SX + .05} y={SY + .12} z={aZ} w={SW - .1} d={1.05} h={aH} className="temple-piece-in" />}

      {/* ── PEDIMENT ── */}
      {(() => {
        const fl = iso(xL, yF, pZ), fr = iso(xR, yF, pZ), fa = iso(xM, yF, apex);
        const bl = iso(xL, yB, pZ), br = iso(xR, yB, pZ), ba = iso(xM, yB, apex);
        if (!a7) return (
          <g opacity={.06}>
            <polygon points={`${pt(fl)} ${pt(fr)} ${pt(fa)}`} fill="none" stroke="rgba(180,170,200,0.15)" strokeWidth={.5} />
            <polygon points={`${pt(fr)} ${pt(br)} ${pt(ba)} ${pt(fa)}`} fill="none" stroke="rgba(180,170,200,0.15)" strokeWidth={.5} />
          </g>
        );
        return (
          <g className="temple-piece-in" style={{ animationDelay: "200ms" }}>
            <polygon points={`${pt(bl)} ${pt(br)} ${pt(ba)}`} fill={P.sR} />
            <polygon points={`${pt(fr)} ${pt(br)} ${pt(ba)} ${pt(fa)}`} fill={P.sL} />
            <polygon points={`${pt(fl)} ${pt(bl)} ${pt(ba)} ${pt(fa)}`} fill={P.sT} />
            <polygon points={`${pt(fl)} ${pt(fr)} ${pt(fa)}`} fill={P.sT} opacity=".95" />
            {/* Ornament */}
            {(() => { const c = iso(xM, yF, pZ + (apex - pZ) * .4); return <circle cx={c.x} cy={c.y} r={4.5} fill="none" stroke={P.lavR} strokeWidth={.7} opacity={.35} />; })()}
            {hestia && (() => {
              const fb = iso(xM, yF - .05, pZ + .5);
              return <g>
                <circle cx={fb.x} cy={fb.y} r={12} fill="rgba(230,180,100,0.15)"><animate attributeName="r" values="10;14;10" dur="4s" repeatCount="indefinite" /></circle>
                <circle cx={fb.x} cy={fb.y} r={5} fill="#E8B060" />
                <circle cx={fb.x} cy={fb.y - 2.5} r={2} fill="#F8E8D0" opacity={.9} />
              </g>;
            })()}
          </g>
        );
      })()}

      {/* ── ACROTERIA ── */}
      {a10 && <g className="temple-piece-in" style={{ animationDelay: "400ms" }}>
        <Box x={xL - .1} y={yF - .1} z={pZ} w={.22} d={.22} h={.42} />
        <Box x={xR - .1} y={yF - .1} z={pZ} w={.22} d={.22} h={.42} />
        <Box x={xM - .12} y={yF - .12} z={apex - .1} w={.25} d={.25} h={.35} top={P.lavT} left={P.lavL} right={P.lavR} />
      </g>}

      {/* ── Floating particles ── */}
      {[[175, 155], [255, 125], [295, 195], [135, 215], [345, 165], [80, 180], [360, 220]].map(([cx, cy], i) => (
        <circle key={`p${i}`} cx={cx} cy={cy} r={1} fill={isNight ? "#D8D0E8" : "#F0E8D0"} opacity={0.12}>
          <animate attributeName="cy" values={`${cy};${cy - 10};${cy}`} dur={`${4 + i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.25;0.05" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
