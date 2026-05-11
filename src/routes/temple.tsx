import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TempleScene } from "@/components/TempleScene";
import { PILLAR_META, PILLAR_ORDER, PRACTICES, type Pillar } from "@/data/practices";
import { usePractices, useProfile } from "@/hooks/useHabits";

export const Route = createFileRoute("/temple")({
  head: () => ({
    meta: [
      { title: "El Temple — Olympía" },
      { name: "description", content: "Visualització silenciosa del progrés acumulat sobre els cinc pilars." },
    ],
  }),
  component: TemplePage,
});

const HESTIA_GOLD = "#F0BD6E";
const HESTIA_DULL = "#6A5E4D";
const STONE = "#F0EBE0";

function TemplePage() {
  const { states } = usePractices();
  const { profile, setProfile } = useProfile();

  const totals: Record<Pillar, number> = useMemo(() => {
    const t: Record<Pillar, number> = { soma: 0, nous: 0, theoria: 0, kosmos: 0, sophrosyne: 0 };
    for (const p of PRACTICES) {
      const s = states[p.id];
      if (!s) continue;
      t[p.pillar] += s.completions.length;
    }
    return t;
  }, [states]);

  return (
    <MobileShell>
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(180deg, var(--temple-sky-1) 0%, var(--temple-sky-2) 100%)",
          color: STONE,
        }}
      >
        <header className="px-6 pt-12 pb-2 relative z-10">
          <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "#8a829a" }}>
            Anastylosis
          </div>
          <h1 className="font-display text-2xl mt-1" style={{ color: STONE, letterSpacing: "0.02em" }}>
            El Temple
          </h1>
          <div className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: "#6a6478" }}>
            Olympía · Jaciment
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-2">
          <TempleScene counts={totals} hestia={profile.hestia} />
        </div>

        <div className="grid grid-cols-5 gap-2 px-5 pt-3">
          {PILLAR_ORDER.map((id) => (
            <div key={id} className="text-center">
              <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: STONE, opacity: 0.85 }}>
                {PILLAR_META[id].label}
              </div>
              <div className="text-[8px] tracking-[0.15em] uppercase mt-1" style={{ color: "#6a6478" }}>
                {String(totals[id]).padStart(3, "0")}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pt-5 pb-10">
          <button onClick={() => setProfile({ ...profile, hestia: !profile.hestia })} className="block w-full" aria-label="Hestia">
            <div
              className="h-[10px] w-full"
              style={{
                background: profile.hestia ? HESTIA_GOLD : HESTIA_DULL,
                boxShadow: profile.hestia ? `0 0 18px ${HESTIA_GOLD}55, 0 0 2px ${HESTIA_GOLD}` : "none",
                transition: "background 1.2s ease, box-shadow 1.2s ease",
              }}
            />
            <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase" style={{ color: "#6a6478" }}>
              <span>Hestia</span>
              <span style={{ color: profile.hestia ? HESTIA_GOLD : "#6a6478" }}>
                {profile.hestia ? "TRUE" : "FALSE"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
