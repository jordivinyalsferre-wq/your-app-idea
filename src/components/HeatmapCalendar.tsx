import { Habit, todayISO } from "@/hooks/useHabits";

export function HeatmapCalendar({ habit }: { habit: Habit }) {
  const set = new Set(habit.completions);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: ({ d: Date; iso: string } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ d: date, iso: todayISO(date) });
  }

  const monthName = first.toLocaleDateString("ca-ES", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="text-sm font-medium capitalize mb-3">{monthName}</div>
      <div className="grid grid-cols-7 gap-1.5 text-[10px] text-muted-foreground mb-1.5">
        {["Dl","Dt","Dc","Dj","Dv","Ds","Dg"].map((d) => <div key={d} className="text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const done = set.has(c.iso);
          const isToday = c.iso === todayISO();
          return (
            <div key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] ${isToday ? "ring-1 ring-foreground/50" : ""}`}
              style={done ? { background: "var(--gradient-sunset)", color: "white", fontWeight: 600 } : { background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {c.d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
