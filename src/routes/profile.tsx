import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Trash2, Flame } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { usePractices, useProfile } from "@/hooks/useHabits";
import { PILLAR_META, PILLAR_ORDER, PRACTICES } from "@/data/practices";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — Naosium" },
      { name: "description", content: "El teu progrés a Naosium: pràctiques actives, ofrenes consagrades i Hèstia." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const { states } = usePractices();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const activeCount = Object.values(states).filter((s) => s.isActive).length;
  const totalOfferings = Object.values(states).reduce((s, p) => s + p.completions.length, 0);

  // Per-pillar counts
  const totals: Record<string, number> = {};
  for (const id of PILLAR_ORDER) totals[id] = 0;
  for (const p of PRACTICES) totals[p.pillar] += states[p.id]?.completions.length ?? 0;

  function exportData() {
    const blob = new Blob([JSON.stringify({ profile, practices: states }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "naosium-export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (!confirm("Esborrar tots els hàbits i el perfil?")) return;
    localStorage.removeItem("olympia.practices.v1");
    localStorage.removeItem("olympia.profile.v1");
    location.reload();
  }

  return (
    <MobileShell>
      <div className="min-h-screen pb-32 bg-background text-foreground">
        <header className="px-6 pt-12 pb-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">ΑΥΤΟΣ</div>
          <h1 className="font-display text-2xl mt-1">Perfil</h1>
        </header>

        {/* Identity */}
        <section className="px-6">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Nom</label>
          <input
            value={hydrated ? profile.name : ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 font-display text-xl outline-none focus:border-primary transition-colors"
          />
        </section>

        {/* Hestia (sacred flame toggle) */}
        <section className="px-6 mt-8">
          <button
            onClick={() => setProfile({ ...profile, hestia: !profile.hestia })}
            className="w-full flex items-center justify-between py-3 border-b border-border"
            aria-pressed={profile.hestia}
          >
            <div className="flex items-center gap-3">
              <Flame className={`h-4 w-4 ${profile.hestia ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-left">
                <div className="text-[14px]">Hèstia</div>
                <div className="text-[11px] text-muted-foreground">El foc sagrat al frontó</div>
              </div>
            </div>
            <span className={`text-[11px] tracking-[0.25em] uppercase ${profile.hestia ? "text-primary" : "text-muted-foreground"}`}>
              {profile.hestia ? "Encesa" : "Apagada"}
            </span>
          </button>
        </section>

        {/* Stats */}
        <section className="px-6 mt-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Anastylosis</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Stat label="Vots actius" value={hydrated ? activeCount : 0} />
            <Stat label="Ofrenes totals" value={hydrated ? totalOfferings : 0} />
          </div>
          <div className="mt-6 grid grid-cols-5 gap-1">
            {PILLAR_ORDER.map((id) => (
              <div key={id} className="text-center">
                <div className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground">{PILLAR_META[id].label}</div>
                <div className="font-display text-[15px] text-foreground/80 mt-0.5 tabular-nums">{hydrated ? totals[id] : 0}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="px-6 mt-12 space-y-1">
          <button onClick={exportData} className="w-full flex items-center gap-3 py-3 border-b border-border text-left">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-[14px]">Exportar dades</span>
          </button>
          <button onClick={reset} className="w-full flex items-center gap-3 py-3 border-b border-border text-left text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="text-[14px]">Esborrar totes les dades</span>
          </button>
        </section>

        <p className="text-center text-[11px] text-muted-foreground mt-12 font-display italic px-6">
          "Som allò que fem repetidament."
        </p>
      </div>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-1 tabular-nums">{value}</div>
    </div>
  );
}
