import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PILLAR_META, PILLAR_ORDER, PRACTICES, type Practice } from "@/data/practices";
import { usePractices, type PracticeState, type HabitFrequency } from "@/hooks/useHabits";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [{ title: "La Pràctica — Olympía" }],
  }),
  component: PracticePage,
});

const BG = "#050410";
const TEXT = "#F0EBE0";
const MUTED = "#6A5E4D";
const ACTIVE = "#F0A05A";
const DIVIDER = "#1a1830";

function PracticePage() {
  return (
    <MobileShell>
      <div className="min-h-screen pb-32" style={{ background: BG, color: TEXT, fontFamily: "Inter, sans-serif" }}>
        <header className="px-6 pt-12 pb-6">
          <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "#5a5566" }}>
            ΚΑΤΑΛΟΓΟΣ
          </div>
          <h1 className="text-2xl mt-1 font-medium" style={{ letterSpacing: "0.01em" }}>
            La Pràctica
          </h1>
          <p className="text-[12px] mt-2 leading-relaxed" style={{ color: "#7a7488" }}>
            Vint-i-cinc vots clàssics. Activa només els que assumeixes.
          </p>
        </header>

        {PILLAR_ORDER.map((pillarId) => {
          const items = PRACTICES.filter((p) => p.pillar === pillarId);
          return (
            <section key={pillarId} className="px-6 mt-2 mb-8">
              <div className="flex items-baseline justify-between pb-2" style={{ borderBottom: `1px solid ${DIVIDER}` }}>
                <h2 className="text-[11px] tracking-[0.3em] uppercase" style={{ color: TEXT }}>
                  {PILLAR_META[pillarId].label}
                </h2>
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#5a5566" }}>
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
    <li style={{ borderBottom: `1px solid ${DIVIDER}` }}>
      <div className="flex items-center justify-between py-4">
        <div className="min-w-0 pr-4">
          <div className="text-[15px]" style={{ color: TEXT }}>{practice.name}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "#7a7488" }}>
            {practice.patron} · <span style={{ color: "#5a5566" }}>{practice.description}</span>
          </div>
        </div>
        <Toggle active={s.isActive} onChange={() => toggleActive(practice.id)} />
      </div>
      {s.isActive && (
        <ParamPanel state={s} onChange={(patch) => setState(practice.id, patch)} />
      )}
    </li>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={active}
      className="relative shrink-0"
      style={{
        width: 36,
        height: 18,
        background: active ? ACTIVE : "transparent",
        border: `1px solid ${active ? ACTIVE : MUTED}`,
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: active ? 20 : 2,
          width: 12,
          height: 12,
          background: active ? "#050410" : MUTED,
          transition: "left 200ms ease, background 200ms ease",
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
    <div className="pb-5 pl-1" style={{ color: TEXT }}>
      <div className="flex items-center justify-between py-2">
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#7a7488" }}>Minuts</span>
        <input
          type="number"
          min={1}
          max={999}
          value={state.targetMinutes}
          onChange={(e) => onChange({ targetMinutes: Math.max(1, Number(e.target.value) || 1) })}
          className="w-16 text-right bg-transparent outline-none text-[15px] tabular-nums"
          style={{ color: ACTIVE, appearance: "textfield" }}
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#7a7488" }}>Freqüència</span>
        <div className="flex gap-3 text-[11px] tracking-[0.18em] uppercase">
          <button onClick={() => setFreq("daily")} style={{ color: isDaily ? ACTIVE : MUTED }}>Diari</button>
          <button onClick={() => setFreq([1, 2, 3, 4, 5])} style={{ color: !isDaily ? ACTIVE : MUTED }}>Dies</button>
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
                className="text-[10px] tracking-[0.15em] uppercase py-1 px-2"
                style={{ color: on ? ACTIVE : MUTED, borderBottom: `1px solid ${on ? ACTIVE : "transparent"}` }}
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
