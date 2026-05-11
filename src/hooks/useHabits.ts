import { useCallback, useEffect, useState } from "react";

export type HabitFrequency = "daily" | number[]; // number[] = ISO weekdays 1..7

export type { Pillar } from "@/data/practices";
import { PILLAR_META, PILLAR_ORDER, type Pillar } from "@/data/practices";
export const PILLARS = PILLAR_ORDER.map((id) => ({
  id,
  label: PILLAR_META[id].label,
  meaning: PILLAR_META[id].meaning,
}));

const PROFILE_KEY = "olympia.profile.v1";

export type Profile = { name: string; onboarded: boolean; hestia: boolean };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function todayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoWeekday(d = new Date()) {
  const w = d.getDay();
  return w === 0 ? 7 : w;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => {
    const p = read<Partial<Profile>>(PROFILE_KEY, {});
    return { name: p.name ?? "", onboarded: p.onboarded ?? false, hestia: p.hestia ?? true };
  });
  useEffect(() => { write(PROFILE_KEY, profile); }, [profile]);
  return { profile, setProfile };
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 6) return "Bona nit";
  if (h < 12) return "Bon dia";
  if (h < 19) return "Bona tarda";
  return "Bon capvespre";
}

// ============= Practices (curated catalog) =============

export type PracticeState = {
  practiceId: string;
  isActive: boolean;
  targetMinutes: number;
  frequency: HabitFrequency;
  completions: string[];
};

const PRACTICES_KEY = "olympia.practices.v1";

function defaultState(id: string): PracticeState {
  return { practiceId: id, isActive: false, targetMinutes: 10, frequency: "daily", completions: [] };
}

export function usePractices() {
  const [states, setStates] = useState<Record<string, PracticeState>>(
    () => read<Record<string, PracticeState>>(PRACTICES_KEY, {}),
  );
  useEffect(() => { write(PRACTICES_KEY, states); }, [states]);

  const getState = useCallback((id: string): PracticeState => states[id] ?? defaultState(id), [states]);

  const setState = useCallback((id: string, patch: Partial<PracticeState>) => {
    setStates((prev) => {
      const cur = prev[id] ?? defaultState(id);
      return { ...prev, [id]: { ...cur, ...patch } };
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setStates((prev) => {
      const cur = prev[id] ?? defaultState(id);
      return { ...prev, [id]: { ...cur, isActive: !cur.isActive } };
    });
  }, []);

  const completeToday = useCallback((id: string, dateISO = todayISO()) => {
    setStates((prev) => {
      const cur = prev[id] ?? defaultState(id);
      const has = cur.completions.includes(dateISO);
      return {
        ...prev,
        [id]: {
          ...cur,
          completions: has ? cur.completions.filter((d) => d !== dateISO) : [...cur.completions, dateISO],
        },
      };
    });
  }, []);

  return { states, getState, setState, toggleActive, completeToday };
}

export function isPracticeDueToday(s: PracticeState, date = new Date()) {
  if (!s.isActive) return false;
  if (s.frequency === "daily") return true;
  return s.frequency.includes(isoWeekday(date));
}
