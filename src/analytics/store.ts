import { create } from "zustand";
import { AnalyticsDateStore, AnalyticsRequestDTO } from "./types";


const today = () => new Date().toISOString().split("T")[0];
const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
};

const defaultParams: AnalyticsRequestDTO = {
    from: daysAgo(29),
    to: today(),
    limit: 10,
};
export const useAnalyticsStore = create<AnalyticsDateStore>((set) => ({
    params: defaultParams,
    setParams: (incoming) =>
        set((state) => ({ params: { ...state.params, ...incoming } })),
    setDateRange: (from, to) =>
        set((state) => ({ params: { ...state.params, from, to } })),
    reset: () => set({ params: defaultParams }),
}));