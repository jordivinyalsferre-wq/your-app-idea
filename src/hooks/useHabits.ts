import { useCallback, useEffect, useState } from "react";

export type HabitFrequency = "daily" | number[]; // number[] = ISO weekdays 1..7

export type Pillar = "soma" | "nous" | "theoria" | "kosmos";
export const PILLARS: { id: Pillar; label: string; meaning: string }[] = [
  { id: "soma", label: "Soma", meaning: "Cos" },
  { id: "nous", label: "Nous", meaning: "Ment" },
  { id: "theoria", label: "Theoria", meaning: "Contemplació" },
  { id: "kosmos", label: "Kosmos", meaning: "Ordre" },
];

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string; // token name: sunset | dawn | mauve | gold
  pillar: Pillar;
  frequency: HabitFrequency;
  reminder?: string | null; // "HH:mm"
  createdAt: string; // ISO date
  completions: string[]; // YYYY-MM-DD
};

const KEY = "olympia.habits.v1";
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

export function isDueToday(habit: Habit, date = new Date()) {
  if (habit.frequency === "daily") return true;
  return habit.frequency.includes(isoWeekday(date));
}

export function streak(habit: Habit) {
  const set = new Set(habit.completions);
  let count = 0;
  const d = new Date();
  while (set.has(todayISO(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function bestStreak(habit: Habit) {
  const sorted = [...habit.completions].sort();
  let best = 0;
  let cur = 0;
  let prev: Date | null = null;
  for (const iso of sorted) {
    const d = new Date(iso + "T00:00:00");
    if (prev && (d.getTime() - prev.getTime()) === 86400000) cur++;
    else cur = 1;
    if (cur > best) best = cur;
    prev = d;
  }
  return best;
}

export function consistency(habit: Habit, days = 30) {
  let due = 0;
  let done = 0;
  const d = new Date();
  for (let i = 0; i < days; i++) {
    if (isDueToday(habit, d)) {
      due++;
      if (habit.completions.includes(todayISO(d))) done++;
    }
    d.setDate(d.getDate() - 1);
  }
  return due === 0 ? 0 : Math.round((done / due) * 100);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => read<Habit[]>(KEY, []));

  useEffect(() => { write(KEY, habits); }, [habits]);

  const addHabit = useCallback((h: Omit<Habit, "id" | "createdAt" | "completions">) => {
    setHabits((prev) => [
      ...prev,
      { ...h, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completions: [] },
    ]);
  }, []);

  const updateHabit = useCallback((id: string, patch: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string, dateISO = todayISO()) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== id) return h;
      const has = h.completions.includes(dateISO);
      return { ...h, completions: has ? h.completions.filter((d) => d !== dateISO) : [...h.completions, dateISO] };
    }));
  }, []);

  return { habits, addHabit, updateHabit, removeHabit, toggleToday };
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
