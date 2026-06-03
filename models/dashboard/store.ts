import { create } from "zustand";
import { DashboardStore} from "./types";

type OrderModal = "createOrder" | "deleteOrder" | "editOrder" | "viewOrder";

const getToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });

const defaultFilters = {
    startDate: getToday(),
    endDate: getToday(),

};

export const useDashboardStore = create<DashboardStore>((set) => ({
    ...defaultFilters,
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
}));