import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Habit, HabitFrequency } from "@/hooks/useHabits";

const COLORS = ["sunset", "dawn", "mauve", "gold"] as const;
const colorVar: Record<string, string> = {
  sunset: "var(--sunset)", dawn: "var(--dawn)", mauve: "var(--mauve)", gold: "var(--gold)",
};
const EMOJIS = ["🏛️", "📖", "🧘", "💧", "🏃", "🌅", "✍️", "🎯", "🍎", "🌿"];
const WEEKDAYS = [
  { v: 1, l: "Dl" }, { v: 2, l: "Dt" }, { v: 3, l: "Dc" }, { v: 4, l: "Dj" },
  { v: 5, l: "Dv" }, { v: 6, l: "Ds" }, { v: 7, l: "Dg" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (h: Omit<Habit, "id" | "createdAt" | "completions">) => void;
  initial?: Habit;
};

export function CreateHabitSheet({ open, onClose, onSave, initial }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏛️");
  const [color, setColor] = useState<string>("sunset");
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setEmoji(initial?.emoji ?? "🏛️");
      setColor(initial?.color ?? "sunset");
      if (initial?.frequency && initial.frequency !== "daily") {
        setMode("weekly"); setDays(initial.frequency);
      } else { setMode("daily"); setDays([1,2,3,4,5]); }
    }
  }, [open, initial]);

  function submit() {
    if (!name.trim()) return;
    const frequency: HabitFrequency = mode === "daily" ? "daily" : days.sort();
    onSave({ name: name.trim(), emoji, color, frequency, reminder: null });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-deep/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50"
          >
            <div className="mx-auto max-w-md bg-card rounded-t-[2rem] shadow-soft border-t border-border p-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-medium">{initial ? "Edita hàbit" : "Nou hàbit"}</h2>
                <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>

              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Llegir 20 minuts"
                className="mt-1.5 w-full rounded-2xl bg-background border border-border px-4 py-3 text-base outline-none focus:border-primary"
              />

              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-5 block">Icona</label>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setEmoji(e)}
                    className={`shrink-0 h-11 w-11 rounded-2xl text-xl flex items-center justify-center border ${emoji === e ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    {e}
                  </button>
                ))}
              </div>

              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-5 block">Color</label>
              <div className="mt-2 flex gap-3">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`h-10 w-10 rounded-2xl ring-offset-2 ring-offset-card transition-all ${color === c ? "ring-2 ring-foreground" : ""}`}
                    style={{ background: colorVar[c] }} />
                ))}
              </div>

              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-5 block">Freqüència</label>
              <div className="mt-2 flex gap-2 p-1 bg-muted rounded-2xl">
                <button onClick={() => setMode("daily")} className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === "daily" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Cada dia</button>
                <button onClick={() => setMode("weekly")} className={`flex-1 py-2 rounded-xl text-sm font-medium ${mode === "weekly" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Dies concrets</button>
              </div>
              {mode === "weekly" && (
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map((d) => {
                    const on = days.includes(d.v);
                    return (
                      <button key={d.v}
                        onClick={() => setDays((prev) => on ? prev.filter((x) => x !== d.v) : [...prev, d.v])}
                        className={`py-2 rounded-xl text-xs font-semibold border ${on ? "bg-gradient-sunset text-white border-transparent" : "border-border text-muted-foreground"}`}>
                        {d.l}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={submit}
                className="mt-7 w-full py-4 rounded-2xl bg-gradient-sunset text-white font-semibold text-base shadow-glow active:scale-[0.99] transition-transform"
              >
                {initial ? "Desa canvis" : "Crear hàbit"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
