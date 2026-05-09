import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { HabitCard } from "@/components/HabitCard";
import { CreateHabitSheet } from "@/components/CreateHabitSheet";
import { todayISO, useHabits } from "@/hooks/useHabits";

export const Route = createFileRoute("/habits")({
  component: HabitsPage,
});

function HabitsPage() {
  const navigate = useNavigate();
  const { habits, addHabit, toggleToday } = useHabits();
  const [open, setOpen] = useState(false);
  const today = todayISO();

  return (
    <MobileShell>
      <div className="px-6 pt-12 pb-4 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tots els</div>
          <h1 className="font-display text-3xl mt-1">Hàbits</h1>
        </div>
        <button onClick={() => setOpen(true)} className="h-11 w-11 rounded-2xl bg-gradient-sunset text-white flex items-center justify-center shadow-glow active:scale-95 transition-transform">
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-5 mt-4 space-y-2.5">
        {habits.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="font-display text-lg">Encara no hi ha cap hàbit</p>
            <p className="text-sm text-muted-foreground mt-1">Toca + per afegir-ne un.</p>
          </div>
        )}
        {habits.map((h) => (
          <HabitCard key={h.id}
            habit={h}
            done={h.completions.includes(today)}
            onToggle={() => toggleToday(h.id)}
            onClick={() => navigate({ to: "/habits/$id", params: { id: h.id } })}
          />
        ))}
      </div>

      <CreateHabitSheet open={open} onClose={() => setOpen(false)} onSave={addHabit} />
    </MobileShell>
  );
}
