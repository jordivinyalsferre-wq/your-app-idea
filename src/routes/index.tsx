import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProgressRing } from "@/components/ProgressRing";
import { HabitCard } from "@/components/HabitCard";
import { CreateHabitSheet } from "@/components/CreateHabitSheet";
import { greeting, isDueToday, todayISO, useHabits, useProfile } from "@/hooks/useHabits";
import heroImg from "@/assets/olympia-sunset.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { profile, setProfile } = useProfile();
  if (!profile.onboarded) return <Onboarding onDone={(name) => setProfile({ name, onboarded: true })} />;
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
          Inspirat en el santuari d'Olímpia entre l'alba i el capvespre. Crea petits rituals i mira'ls créixer.
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
  const navigate = useNavigate();
  const { habits, toggleToday } = useHabits();
  const [open, setOpen] = useState(false);
  const { addHabit } = useHabits();

  const due = useMemo(() => habits.filter((h) => isDueToday(h)), [habits]);
  const today = todayISO();
  const doneCount = due.filter((h) => h.completions.includes(today)).length;
  const pct = due.length === 0 ? 0 : doneCount / due.length;
  const date = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <MobileShell>
      <div className="relative px-6 pt-12 pb-8 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-sunset)" }}
        />
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
            <div className="text-sm text-muted-foreground">Progrés del dia</div>
            <div className="font-display text-xl mt-1">{Math.round(pct * 100)}%</div>
            <div className="text-xs text-muted-foreground mt-1.5">{due.length === 0 ? "Comença creant un hàbit" : pct === 1 ? "Has tancat el dia." : "Petites passes, grans canvis."}</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-2">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="font-display text-xl">Els teus rituals</h2>
          <button onClick={() => setOpen(true)} className="h-9 w-9 rounded-full bg-gradient-sunset text-white flex items-center justify-center shadow-glow active:scale-95 transition-transform">
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {due.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-border p-8 text-center">
            <div className="text-3xl">🏛️</div>
            <p className="mt-2 font-display text-lg">Tot per construir.</p>
            <p className="text-sm text-muted-foreground mt-1">Crea el teu primer hàbit per començar.</p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {due.map((h) => (
              <HabitCard key={h.id}
                habit={h}
                done={h.completions.includes(today)}
                onToggle={() => toggleToday(h.id)}
                onClick={() => navigate({ to: "/habits/$id", params: { id: h.id } })}
              />
            ))}
          </div>
        )}
      </div>

      <CreateHabitSheet open={open} onClose={() => setOpen(false)} onSave={addHabit} />
    </MobileShell>
  );
}
