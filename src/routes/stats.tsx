import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { consistency, isDueToday, streak, todayISO, useHabits } from "@/hooks/useHabits";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

function StatsPage() {
  const { habits } = useHabits();

  const data = useMemo(() => {
    const totalCheckins = habits.reduce((s, h) => s + h.completions.length, 0);
    const strongest = habits.slice().sort((a, b) => streak(b) - streak(a))[0];

    // last 7 days bars
    const days: { label: string; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = todayISO(d);
      const due = habits.filter((h) => isDueToday(h, d));
      const done = due.filter((h) => h.completions.includes(iso)).length;
      const pct = due.length === 0 ? 0 : done / due.length;
      days.push({ label: ["Dg","Dl","Dt","Dc","Dj","Dv","Ds"][d.getDay()], pct });
    }

    const weekly = Math.round((days.reduce((s, x) => s + x.pct, 0) / 7) * 100);
    return { totalCheckins, strongest, days, weekly };
  }, [habits]);

  return (
    <MobileShell>
      <div className="px-6 pt-12 pb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">El teu</div>
        <h1 className="font-display text-3xl mt-1">Recorregut</h1>
      </div>

      <div className="px-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-3xl bg-card border border-border p-4 shadow-soft">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Setmana</div>
          <div className="font-display text-3xl mt-1 text-gradient-sunset">{data.weekly}%</div>
          <div className="text-xs text-muted-foreground mt-1">constància</div>
        </div>
        <div className="rounded-3xl bg-card border border-border p-4 shadow-soft">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
          <div className="font-display text-3xl mt-1">{data.totalCheckins}</div>
          <div className="text-xs text-muted-foreground mt-1">marques</div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
          <div className="text-sm font-medium mb-4">Últims 7 dies</div>
          <div className="flex items-end justify-between gap-2 h-32">
            {data.days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${Math.max(d.pct * 100, 4)}%`,
                      background: d.pct > 0 ? "var(--gradient-sunset)" : "var(--muted)",
                    }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.strongest && streak(data.strongest) > 0 && (
        <div className="px-5 mt-4">
          <div className="rounded-3xl p-5 text-white shadow-soft" style={{ background: "var(--gradient-sunset)" }}>
            <div className="text-[10px] uppercase tracking-wider opacity-80">Hàbit més fort</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl">{data.strongest.emoji}</span>
              <div>
                <div className="font-display text-xl">{data.strongest.name}</div>
                <div className="text-sm opacity-90">{streak(data.strongest)} dies seguits · {consistency(data.strongest, 30)}% els últims 30</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="px-5 mt-4">
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="font-display text-lg">Encara no hi ha dades</p>
            <p className="text-sm text-muted-foreground mt-1">Crea hàbits i marca'ls per veure el teu recorregut.</p>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
