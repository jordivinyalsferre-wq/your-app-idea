import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronUp } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { TempleScene } from "@/components/TempleScene";
import { greeting, isPracticeDueToday, todayISO, usePractices, useProfile } from "@/hooks/useHabits";
import { PRACTICES, PILLAR_META, PILLAR_ORDER, type Pillar } from "@/data/practices";

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "Naosium — Reconstrueix el teu temple" },
        { name: "description", content: "Pràctica diària clàssica inspirada en la filosofia grega. Reconstrueix el temple del teu ésser, un tambor cada dia." },
        { property: "og:title", content: "Naosium — Reconstrueix el teu temple" },
        { property: "og:description", content: "No estàs trencat. Estàs en ruïnes. Les ruïnes es restauren." },
        { property: "og:type", content: "website" },
      ],
    }),
    component: Index,
  },
);

function Index() {
  const { profile, setProfile } = useProfile();
  if (!profile.onboarded) return <Onboarding onDone={(name) => setProfile({ ...profile, name, onboarded: true })} />;
  return <TempleHome name={profile.name} />;
}

/* ─── Onboarding ─── */

function Onboarding({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <MobileShell hideTabs>
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        {/* Subtle radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, oklch(0.74 0.18 42) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center max-w-sm"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6">Τ Ο  Μ Α Ν Τ Ε Ι Ο Ν</div>
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight">
            No estàs trencat.<br />
            <span className="text-gradient-sunset">Estàs en ruïnes.</span>
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed mt-6">
            Les ruïnes es restauren. Un tambor cada dia, una columna cada any. Benvingut al treball.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative mt-12 w-full max-w-sm"
        >
          <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] mb-2">El teu nom</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Com t'has de dir?"
            className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-base outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
          />
          <button
            onClick={() => onDone(name.trim() || "Atleta")}
            className="mt-4 w-full py-4 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-foreground font-medium text-[15px] hover:bg-white/[0.1] active:scale-[0.99] transition-all"
          >
            Comença la restauració
          </button>
        </motion.div>
      </div>
    </MobileShell>
  );
}

/* ─── Temple Home (main screen) ─── */

function TempleHome({ name }: { name: string }) {
  const { states, completeToday } = usePractices();
  const { profile } = useProfile();
  const today = todayISO();
  const [expanded, setExpanded] = useState(false);

  const due = useMemo(
    () => PRACTICES
      .map((p) => ({ practice: p, state: states[p.id] }))
      .filter(({ state }) => state && isPracticeDueToday(state)),
    [states],
  );
  const doneCount = due.filter(({ state }) => state!.completions.includes(today)).length;
  const pct = due.length === 0 ? 0 : doneCount / due.length;

  const totals: Record<Pillar, number> = useMemo(() => {
    const t: Record<Pillar, number> = { soma: 0, nous: 0, theoria: 0, kosmos: 0, sophrosyne: 0 };
    for (const p of PRACTICES) {
      const s = states[p.id];
      if (!s) continue;
      t[p.pillar] += s.completions.length;
    }
    return t;
  }, [states]);

  const date = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Header — minimal, floating */}
        <header className="relative z-10 px-6 pt-safe-top">
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/30">{date}</div>
              <h1 className="font-display text-xl mt-0.5">
                {greeting()}, <span className="text-gradient-sunset">{name}</span>
              </h1>
            </div>
            {due.length > 0 && (
              <div className="text-right">
                <div className="font-display text-2xl leading-none">{Math.round(pct * 100)}<span className="text-sm text-white/40">%</span></div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">{doneCount}/{due.length} avui</div>
              </div>
            )}
          </div>
        </header>

        {/* Temple — centre of the universe */}
        <div className="flex-1 flex items-center justify-center px-4 -mt-4">
          <motion.div
            className="w-full max-w-md"
            style={{ aspectRatio: "420 / 360" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <TempleScene counts={totals} hestia={profile.hestia} />
          </motion.div>
        </div>

        {/* Pillar counters — minimal bar */}
        <div className="relative z-10 grid grid-cols-5 gap-1 px-6 -mt-2">
          {PILLAR_ORDER.map((id) => (
            <div key={id} className="text-center">
              <div className="text-[8px] tracking-[0.15em] uppercase text-white/25">{PILLAR_META[id].label}</div>
              <div className="font-display text-[13px] text-white/60 mt-0.5 tabular-nums">{totals[id]}</div>
            </div>
          ))}
        </div>

        {/* Bottom drawer — today's practices */}
        <div className="relative z-10 mt-4 px-4 pb-28">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="text-[13px] font-medium">
                {due.length === 0 ? "Cap pràctica activa" : `${doneCount} de ${due.length} ofrenes`}
              </div>
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronUp className="h-4 w-4 text-white/40" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-1.5">
                  {due.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.08] p-6 text-center">
                      <p className="text-sm text-white/40">Vés a <Link to="/habits" className="text-gradient-sunset font-semibold">La Pràctica</Link> i consagra el primer vot.</p>
                    </div>
                  ) : (
                    due.map(({ practice, state }) => {
                      const done = state!.completions.includes(today);
                      return (
                        <motion.div
                          key={practice.id}
                          layout
                          className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px]">{practice.name}</div>
                            <div className="text-[10px] text-white/30 mt-0.5 tracking-wide">
                              {PILLAR_META[practice.pillar].label} · {state!.targetMinutes} min
                            </div>
                          </div>
                          <button
                            onClick={() => completeToday(practice.id)}
                            aria-label={done ? "Anul·lar ofrena" : "Consagrar avui"}
                            className="h-9 w-9 rounded-xl border flex items-center justify-center transition-all"
                            style={done
                              ? { background: "var(--gradient-sunset)", borderColor: "transparent", boxShadow: "0 0 20px oklch(0.74 0.19 45 / 0.4)" }
                              : { borderColor: "rgba(255,255,255,0.08)" }
                            }
                          >
                            {done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileShell>
  );
}
