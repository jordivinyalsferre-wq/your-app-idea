import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { PILLAR_META, PILLAR_ORDER, PRACTICES, type Practice } from "@/data/practices";
import { usePractices, type PracticeState, type HabitFrequency } from "@/hooks/useHabits";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "La Pràctica — Naosium" },
      { name: "description", content: "Vint-i-cinc vots clàssics agrupats en cinc pilars. Activa només els que assumeixes." },
      { property: "og:title", content: "La Pràctica — Naosium" },
      { property: "og:description", content: "El catàleg dels vint-i-cinc vots: Soma, Nous, Theoria, Kosmos, Sophrosyne." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <MobileShell>
      <div className="min-h-screen pb-32 bg-background text-foreground">
        <header className="px-6 pt-12 pb-6">
          <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            ΚΑΤΑΛΟΓΟΣ
          </div>
          <h1 className="font-display text-2xl mt-1">La Pràctica</h1>
          <p className="text-[12px] mt-2 leading-relaxed text-muted-foreground">
            Vint-i-cinc vots clàssics. Activa només els que assumeixes.
          </p>
        </header>

        {PILLAR_ORDER.map((pillarId) => {
          const items = PRACTICES.filter((p) => p.pillar === pillarId);
          return (
            <section key={pillarId} className="px-6 mt-2 mb-8">
              <div className="flex items-baseline justify-between pb-2 border-b border-border">
                <h2 className="text-[11px] tracking-[0.3em] uppercase text-foreground">
                  {PILLAR_META[pillarId].label}
                </h2>
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {PILLAR_META[pillarId].meaning}
                </span>
              </div>
              <ul>
                {items.map((p) => (
                  <PracticeRow key={p.id} practice={p} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </MobileShell>
  );
}

function PracticeRow({ practice }: { practice: Practice }) {
  const { getState, setState, toggleActive } = usePractices();
  const s = getState(practice.id);
  return (
    <li className="border-b border-border">
      <div className="flex items-center justify-between py-4">
        <div className="min-w-0 pr-4">
          <div className="text-[15px] text-foreground">{practice.name}</div>
          <div className="text-[11px] mt-0.5 text-muted-foreground">
            {practice.patron} <span className="opacity-70">· {practice.description}</span>
          </div>
        </div>
        <Toggle active={s.isActive} onChange={() => toggleActive(practice.id)} />
      </div>
      {s.isActive && <ParamPanel state={s} onChange={(patch) => setState(practice.id, patch)} />}
    </li>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={active}
      className="relative shrink-0 h-[18px] w-9 transition-colors"
      style={{
        background: active ? "var(--primary)" : "transparent",
        border: `1px solid ${active ? "var(--primary)" : "var(--muted-foreground)"}`,
      }}
    >
      <span
        className="absolute top-[2px] h-3 w-3 transition-all"
        style={{
          left: active ? 20 : 2,
          background: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
        }}
      />
    </button>
  );
}

const WEEKDAYS = [
  { v: 1, l: "Dl" }, { v: 2, l: "Dt" }, { v: 3, l: "Dc" }, { v: 4, l: "Dj" },
  { v: 5, l: "Dv" }, { v: 6, l: "Ds" }, { v: 7, l: "Dg" },
];

function ParamPanel({ state, onChange }: { state: PracticeState; onChange: (patch: Partial<PracticeState>) => void }) {
  const isDaily = state.frequency === "daily";
  const days = isDaily ? [] : (state.frequency as number[]);

  const setFreq = (f: HabitFrequency) => onChange({ frequency: f });
  const toggleDay = (v: number) => {
    const next = days.includes(v) ? days.filter((d) => d !== v) : [...days, v].sort();
    setFreq(next.length ? next : [v]);
  };

  return (
    <div className="pb-5 pl-1">
      <div className="flex items-center justify-between py-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Minuts</span>
        <input
          type="number"
          min={1}
          max={999}
          value={state.targetMinutes}
          onChange={(e) => onChange({ targetMinutes: Math.max(1, Number(e.target.value) || 1) })}
          className="w-16 text-right bg-transparent outline-none text-[15px] tabular-nums text-primary"
          style={{ appearance: "textfield" }}
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">Freqüència</span>
        <div className="flex gap-3 text-[11px] tracking-[0.18em] uppercase">
          <button onClick={() => setFreq("daily")} className={isDaily ? "text-primary" : "text-muted-foreground"}>Diari</button>
          <button onClick={() => setFreq([1, 2, 3, 4, 5])} className={!isDaily ? "text-primary" : "text-muted-foreground"}>Dies</button>
        </div>
      </div>
      {!isDaily && (
        <div className="flex justify-between pt-1">
          {WEEKDAYS.map((d) => {
            const on = days.includes(d.v);
            return (
              <button
                key={d.v}
                onClick={() => toggleDay(d.v)}
                className={`text-[10px] tracking-[0.15em] uppercase py-1 px-2 ${on ? "text-primary" : "text-muted-foreground"}`}
                style={{ borderBottom: `1px solid ${on ? "var(--primary)" : "transparent"}` }}
              >
                {d.l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
