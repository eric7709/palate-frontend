import { create } from "zustand";
import { EmployeeStore } from "./types";

type EmployeeModal = "createEmployee" | "deleteEmployee" | "editEmployee";

const initialFilters = {
    search: "",
    role: "",
    status: "",
    page: 0,
    size: 30,
    sortBy: "id",
    sortDirection: "desc" as const,
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    selectedEmployeeId: null,
    modal: null,
    ...initialFilters,
    setSearch(search) {
        set({ search });
    },
    setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null, selectedEmployeeId: null }),
    setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    resetFilters: () => set({ ...initialFilters }),
}));