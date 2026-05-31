// store/filters/analytics.filter.store.ts

import { create } from "zustand";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfYesterday,
  endOfYesterday,
} from "date-fns";

export type AnalyticsPreset =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "custom";

const toISO = (d: Date) => d.toISOString();
const now   = ()         => new Date();

const PRESET_RANGES: Record<
  Exclude<AnalyticsPreset, "custom">,
  () => { startDate: string; endDate: string }
> = {
  today:     () => ({ startDate: toISO(startOfDay(now())),    endDate: toISO(endOfDay(now())) }),
  yesterday: () => ({ startDate: toISO(startOfYesterday()),   endDate: toISO(endOfYesterday()) }),
  "7d":      () => ({ startDate: toISO(startOfDay(subDays(now(), 7))),  endDate: toISO(endOfDay(now())) }),
  "30d":     () => ({ startDate: toISO(startOfDay(subDays(now(), 30))), endDate: toISO(endOfDay(now())) }),
  "90d":     () => ({ startDate: toISO(startOfDay(subDays(now(), 90))), endDate: toISO(endOfDay(now())) }),
};

interface AnalyticsFilterState {
  preset: AnalyticsPreset;
  startDate: string;
  endDate: string;

  setPreset: (preset: Exclude<AnalyticsPreset, "custom">) => void;
  setCustomRange: (startDate: string, endDate: string) => void;
  reset: () => void;
}

const DEFAULT = PRESET_RANGES["7d"]();

export const useAnalyticsFilterStore = create<AnalyticsFilterState>((set) => ({
  preset:    "7d",
  startDate: DEFAULT.startDate,
  endDate:   DEFAULT.endDate,

  setPreset: (preset) =>
    set({ preset, ...PRESET_RANGES[preset]() }),

  setCustomRange: (startDate, endDate) =>
    set({ preset: "custom", startDate, endDate }),

  reset: () =>
    set({ preset: "7d", ...DEFAULT }),
}));