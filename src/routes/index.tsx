import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProgressRing } from "@/components/ProgressRing";
import { greeting, isPracticeDueToday, todayISO, usePractices, useProfile } from "@/hooks/useHabits";
import { PRACTICES, PILLAR_META } from "@/data/practices";
import heroImg from "@/assets/olympia-sunset.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { profile, setProfile } = useProfile();
  if (!profile.onboarded) return <Onboarding onDone={(name) => setProfile({ ...profile, name, onboarded: true })} />;
  return <Today name={profile.name} />;
}

function Onboarding({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <MobileShell hideTabs>
      <div className="relative h-[55vh] overflow-hidden rounded-b-[2.5rem]">
        <img src={heroImg} alt="Columnes d'Olímpia al capvespre" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, oklch(0.22 0.03 40 / 0.55) 100%)" }} />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-medium tracking-wider uppercase">
            <Sparkles className="h-3 w-3" /> Olympía
          </div>
          <h1 className="font-display text-4xl mt-3 leading-[1.05]">Construeix-te,<br/>dia rere dia.</h1>
        </div>
      </div>
      <div className="px-6 pt-7">
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          Inspirat en el santuari d'Olímpia entre l'alba i el capvespre. Tria els teus vots, sostén la mesura.
        </p>
        <label className="mt-7 block text-xs font-medium text-muted-foreground uppercase tracking-wider">El teu nom</label>
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Com t'has de dir?"
          className="mt-2 w-full rounded-2xl bg-card border border-border px-4 py-3.5 text-base outline-none focus:border-primary"
        />
        <button
          onClick={() => onDone(name.trim() || "Atleta")}
          className="mt-5 w-full py-4 rounded-2xl bg-gradient-sunset text-white font-semibold text-base shadow-glow active:scale-[0.99] transition-transform"
        >
          Comença
        </button>
      </div>
    </MobileShell>
  );
}

function Today({ name }: { name: string }) {
  const { states, completeToday } = usePractices();
  const today = todayISO();

  const due = useMemo(
    () => PRACTICES
      .map((p) => ({ practice: p, state: states[p.id] }))
      .filter(({ state }) => state && isPracticeDueToday(state)),
    [states],
  );
  const doneCount = due.filter(({ state }) => state!.completions.includes(today)).length;
  const pct = due.length === 0 ? 0 : doneCount / due.length;
  const date = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <MobileShell>
      <div className="relative px-6 pt-12 pb-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-sunset)" }} />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{date}</div>
          <h1 className="font-display text-3xl mt-1.5">{greeting()}, <span className="text-gradient-sunset">{name}</span>.</h1>
        </div>

        <div className="relative mt-6 flex items-center gap-5 rounded-3xl bg-card border border-border p-5 shadow-soft">
          <ProgressRing value={pct} size={108} stroke={11}>
            <div className="text-center">
              <div className="font-display text-2xl leading-none">{doneCount}<span className="text-muted-foreground text-sm">/{due.length}</span></div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">avui</div>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">L'ofrena del dia</div>
            <div className="font-display text-xl mt-1">{Math.round(pct * 100)}%</div>
            <div className="text-xs text-muted-foreground mt-1.5">
              {due.length === 0 ? "Consagra una pràctica al catàleg." : pct === 1 ? "Vots complerts." : "Mesura, no excés."}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-2">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="font-display text-xl">Vots d'avui</h2>
        </div>

        {due.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="font-display text-lg">Cap pràctica activa.</p>
            <p className="text-sm text-muted-foreground mt-1">Vés a <Link to="/habits" className="text-gradient-sunset font-semibold">La Pràctica</Link> i consagra la primera.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {due.map(({ practice, state }) => {
              const done = state!.completions.includes(today);
              return (
                <div key={practice.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border/70 px-4 py-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] truncate">{practice.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 tracking-wide">
                      {PILLAR_META[practice.pillar].label} · {state!.targetMinutes} min
                    </div>
                  </div>
                  <button
                    onClick={() => completeToday(practice.id)}
                    aria-label={done ? "Anul·lar ofrena" : "Consagrar avui"}
                    className="h-10 w-10 rounded-xl border border-border flex items-center justify-center transition-all"
                    style={done ? { background: "var(--gradient-sunset)", borderColor: "transparent", boxShadow: "var(--shadow-glow)" } : undefined}
                  >
                    {done && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
