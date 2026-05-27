import { create } from "zustand";
import { EmployeeStore } from "./types";

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
    isFormOpen: false,
    isDeleteModalOpen: false,
    ...initialFilters,
    setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
    openForm: (id) => set({ isFormOpen: true, selectedEmployeeId: id || null }),
    closeForm: () => set({ isFormOpen: false, selectedEmployeeId: null }),
    openDeleteModal: (id) => set({ isDeleteModalOpen: true, selectedEmployeeId: id }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedEmployeeId: null }),
    setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    resetFilters: () => set({ ...initialFilters }),
}));