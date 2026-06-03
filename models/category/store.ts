import { create } from "zustand";
import { CategoryStore } from "./types";

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
    status: "",
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: null,
    modal: null,
    ...defaultFilters,

    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null, selectedCategory: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    resetFilters: () => set({ ...defaultFilters }),
}));