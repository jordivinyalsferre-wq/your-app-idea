import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Habit, streak } from "@/hooks/useHabits";

const colorMap: Record<string, string> = {
  sunset: "var(--sunset)",
  dawn: "var(--dawn)",
  mauve: "var(--mauve)",
  gold: "var(--gold)",
};

export function HabitCard({ habit, done, onToggle, onClick }: {
  habit: Habit;
  done: boolean;
  onToggle: () => void;
  onClick?: () => void;
}) {
  const s = streak(habit);
  const c = colorMap[habit.color] ?? "var(--sunset)";
  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-3xl bg-card border border-border/70 p-3.5 shadow-soft"
    >
      <button
        onClick={onClick}
        className="flex-1 flex items-center gap-3 text-left"
      >
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `color-mix(in oklch, ${c} 18%, transparent)` }}
        >
          <span>{habit.emoji}</span>
        </div>
        <div className="min-w-0">
          <div className="font-medium truncate">{habit.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            {s > 0 ? <span className="text-gradient-sunset font-semibold">{s} dies</span> : <span>Sense ratxa</span>}
            <span className="opacity-50">·</span>
            <span>{habit.frequency === "daily" ? "Diari" : `${habit.frequency.length}/setmana`}</span>
          </div>
        </div>
      </button>
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.88 }}
        aria-label={done ? "Desmarcar" : "Marcar com a fet"}
        className="relative h-11 w-11 rounded-2xl border border-border flex items-center justify-center transition-all"
        style={done ? { background: "var(--gradient-sunset)", borderColor: "transparent", boxShadow: "var(--shadow-glow)" } : undefined}
      >
        {done && <Check className="h-5 w-5 text-white" strokeWidth={3} />}
      </motion.button>
    </motion.div>
  );
}
