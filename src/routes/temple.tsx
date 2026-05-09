import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PILLARS, Pillar, useHabits, useProfile } from "@/hooks/useHabits";

export const Route = createFileRoute("/temple")({
  head: () => ({
    meta: [
      { title: "El Temple — Olympía" },
      { name: "description", content: "Visualització silenciosa del progrés acumulat sobre els quatre pilars." },
    ],
  }),
  component: TemplePage,
});

const HESTIA_GOLD = "#F0BD6E";
const HESTIA_DULL = "#6A5E4D";
const DRUM = "#F0EBE0";
const BG = "#050410";

function TemplePage() {
  const { habits } = useHabits();
  const { profile, setProfile } = useProfile();

  const totals: Record<Pillar, number> = useMemo(() => {
    const t: Record<Pillar, number> = { soma: 0, nous: 0, theoria: 0, kosmos: 0 };
    for (const h of habits) t[h.pillar] = (t[h.pillar] ?? 0) + h.completions.length;
    return t;
  }, [habits]);

  return (
    <MobileShell>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: BG, color: DRUM }}
      >
        <header className="px-6 pt-12 pb-4">
          <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "#5a5566" }}>
            Anastylosis
          </div>
          <h1 className="font-display text-2xl mt-1" style={{ color: DRUM, letterSpacing: "0.02em" }}>
            El Temple
          </h1>
        </header>

        <div className="flex-1 flex items-end justify-center gap-5 px-8 pb-2 min-h-[420px]">
          {PILLARS.map((p) => (
            <ColumnView key={p.id} count={totals[p.id]} />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-5 px-8 pt-3">
          {PILLARS.map((p) => (
            <div key={p.id} className="text-center">
              <div className="text-[10px] tracking-[0.25em] uppercase" style={{ color: DRUM, opacity: 0.85 }}>
                {p.label}
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase mt-1" style={{ color: "#5a5566" }}>
                {String(totals[p.id]).padStart(3, "0")}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pt-5 pb-10">
          <button
            onClick={() => setProfile({ ...profile, hestia: !profile.hestia })}
            className="block w-full"
            aria-label="Hestia"
          >
            <div
              className="h-[10px] w-full"
              style={{
                background: profile.hestia ? HESTIA_GOLD : HESTIA_DULL,
                boxShadow: profile.hestia ? `0 0 18px ${HESTIA_GOLD}55, 0 0 2px ${HESTIA_GOLD}` : "none",
                transition: "background 1.2s ease, box-shadow 1.2s ease",
              }}
            />
            <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase" style={{ color: "#5a5566" }}>
              <span>Hestia</span>
              <span style={{ color: profile.hestia ? HESTIA_GOLD : "#5a5566" }}>
                {profile.hestia ? "TRUE" : "FALSE"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function ColumnView({ count }: { count: number }) {
  const VISIBLE_MAX = 28;
  const drums = Math.min(count, VISIBLE_MAX);
  return (
    <div className="flex-1 h-full flex flex-col-reverse items-center gap-[1px] min-h-[380px]">
      {Array.from({ length: drums }).map((_, i) => (
        <div
          key={i}
          className="w-full"
          style={{
            height: 10,
            background: DRUM,
            animation: "templeDrumIn 1.2s ease-out both",
            animationDelay: `${Math.min(i, 8) * 40}ms`,
          }}
        />
      ))}
      <div className="w-full" style={{ height: 1, background: "#1a1830" }} />
      <style>{`
        @keyframes templeDrumIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
