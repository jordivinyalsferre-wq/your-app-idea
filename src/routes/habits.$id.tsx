import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { HeatmapCalendar } from "@/components/HeatmapCalendar";
import { CreateHabitSheet } from "@/components/CreateHabitSheet";
import { bestStreak, consistency, streak, useHabits } from "@/hooks/useHabits";

export const Route = createFileRoute("/habits/$id")({
  component: HabitDetail,
});

function HabitDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { habits, updateHabit, removeHabit } = useHabits();
  const habit = habits.find((h) => h.id === id);
  const [edit, setEdit] = useState(false);

  if (!habit) {
    return (
      <MobileShell>
        <div className="px-6 pt-16">
          <p className="text-muted-foreground">Aquest hàbit no existeix.</p>
          <Link to="/habits" className="text-primary mt-3 inline-block">Tornar</Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="relative px-6 pt-12 pb-8 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-sunset)" }} />
        <div className="relative flex items-center justify-between">
          <button onClick={() => navigate({ to: "/habits" })} className="h-10 w-10 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setEdit(true)} className="h-10 w-10 rounded-2xl bg-card border border-border flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
            <button
              onClick={() => { if (confirm("Eliminar aquest hàbit?")) { removeHabit(habit.id); navigate({ to: "/habits" }); } }}
              className="h-10 w-10 rounded-2xl bg-card border border-border text-destructive flex items-center justify-center"
            ><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="relative mt-6">
          <div className="text-5xl">{habit.emoji}</div>
          <h1 className="font-display text-3xl mt-3">{habit.name}</h1>
          <div className="text-sm text-muted-foreground mt-1">{habit.frequency === "daily" ? "Cada dia" : `${habit.frequency.length} dies/setmana`}</div>
        </div>
      </div>

      <div className="px-5 grid grid-cols-3 gap-2.5">
        <Stat label="Ratxa" value={`${streak(habit)}d`} highlight />
        <Stat label="Millor" value={`${bestStreak(habit)}d`} />
        <Stat label="30 dies" value={`${consistency(habit, 30)}%`} />
      </div>

      <div className="px-5 mt-6">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
          <HeatmapCalendar habit={habit} />
        </div>
      </div>

      <CreateHabitSheet open={edit} onClose={() => setEdit(false)} initial={habit}
        onSave={(patch) => updateHabit(habit.id, patch)} />
    </MobileShell>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3.5 shadow-soft">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-2xl mt-1 ${highlight ? "text-gradient-sunset" : ""}`}>{value}</div>
    </div>
  );
}
