import { useSyncExternalStore } from "react";
import { PILLAR_ORDER, type Pillar } from "@/data/practices";

export type { Pillar };
export type HabitFrequency = "daily" | number[]; // ISO weekdays 1..7

export type Profile = { name: string; onboarded: boolean; hestia: boolean };
export type PracticeState = {
  practiceId: string;
  isActive: boolean;
  targetMinutes: number;
  frequency: HabitFrequency;
  completions: string[];
};

const PROFILE_KEY = "olympia.profile.v1";
const PRACTICES_KEY = "olympia.practices.v1";

const DEFAULT_PROFILE: Profile = { name: "", onboarded: false, hestia: true };

/* ─── Date helpers ─── */
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
export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 6) return "Bona nit";
  if (h < 12) return "Bon dia";
  if (h < 19) return "Bona tarda";
  return "Bon capvespre";
}
export function isPracticeDueToday(s: PracticeState, date = new Date()) {
  if (!s.isActive) return false;
  if (s.frequency === "daily") return true;
  return s.frequency.includes(isoWeekday(date));
}

function defaultPracticeState(id: string): PracticeState {
  return { practiceId: id, isActive: false, targetMinutes: 10, frequency: "daily", completions: [] };
}

/* ─── Shared store (useSyncExternalStore) ─────────────────────────────── */

type Store<T> = {
  get: () => T;
  set: (next: T) => void;
  subscribe: (l: () => void) => () => void;
  serverSnapshot: T;
};

function createStore<T>(key: string, fallback: T): Store<T> {
  let state: T = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch { /* ignore */ }
  }

  return {
    get: () => { load(); return state; },
    set: (next: T) => {
      state = next;
      if (typeof window !== "undefined") {
        try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      }
      listeners.forEach((l) => l());
    },
    subscribe: (l) => {
      listeners.add(l);
      // Cross-tab sync
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        try { state = e.newValue ? (JSON.parse(e.newValue) as T) : fallback; } catch { /* ignore */ }
        listeners.forEach((fn) => fn());
      };
      if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(l);
        if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },
    serverSnapshot: fallback,
  };
}

const profileStore = createStore<Profile>(PROFILE_KEY, DEFAULT_PROFILE);
const practicesStore = createStore<Record<string, PracticeState>>(PRACTICES_KEY, {});

/* ─── Hooks ─────────────────────────────────────────────────────────── */

export function useProfile() {
  const profile = useSyncExternalStore(
    profileStore.subscribe,
    profileStore.get,
    () => profileStore.serverSnapshot,
  );
  return {
    profile,
    setProfile: (next: Profile | ((p: Profile) => Profile)) =>
      profileStore.set(typeof next === "function" ? (next as (p: Profile) => Profile)(profile) : next),
  };
}

export function usePractices() {
  const states = useSyncExternalStore(
    practicesStore.subscribe,
    practicesStore.get,
    () => practicesStore.serverSnapshot,
  );

  const getState = (id: string): PracticeState => states[id] ?? defaultPracticeState(id);

  const setState = (id: string, patch: Partial<PracticeState>) => {
    const cur = states[id] ?? defaultPracticeState(id);
    practicesStore.set({ ...states, [id]: { ...cur, ...patch } });
  };

  const toggleActive = (id: string) => {
    const cur = states[id] ?? defaultPracticeState(id);
    practicesStore.set({ ...states, [id]: { ...cur, isActive: !cur.isActive } });
  };

  const completeToday = (id: string, dateISO = todayISO()) => {
    const cur = states[id] ?? defaultPracticeState(id);
    const has = cur.completions.includes(dateISO);
    practicesStore.set({
      ...states,
      [id]: {
        ...cur,
        completions: has ? cur.completions.filter((d) => d !== dateISO) : [...cur.completions, dateISO],
      },
    });
  };

  return { states, getState, setState, toggleActive, completeToday };
}

/* Helper for components that need a hydration-safe flag */
export { PILLAR_ORDER };
