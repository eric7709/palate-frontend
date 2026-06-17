import { create } from "zustand";
import { EmployeeStore } from "./types";

const initialFilters = {
    search: "",
    role: null,
    status: "",
    page: 0,
    size: 30,
    sortBy: "id",
    sortDirection: "desc" as const,
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    selectedEmployee: null,
    modal: null,
    ...initialFilters,
    setSearch(search) {
        set({ search });
    },
    setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null, selectedEmployee: null }),
    setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    resetFilters: () => set({ ...initialFilters }),
}));