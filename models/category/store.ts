import { create } from "zustand";
import { CategoryResponseDTO } from "./types";

interface CategoryStore {
    selectedCategory: CategoryResponseDTO | null;
    isFormOpen: boolean;
    isDeleteModalOpen: boolean;

    // Pagination & filters
    page: number;
    size: number;
    search: string;
    status: string;

    setSelectedCategory: (category: CategoryResponseDTO | null) => void;
    openForm: () => void;
    closeForm: () => void;
    openDeleteModal: () => void;
    closeDeleteModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
    resetFilters: () => void;
}

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
    status: "",
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: null,
    isFormOpen: false,
    isDeleteModalOpen: false,
    ...defaultFilters,

    setSelectedCategory: (category) => set({ selectedCategory: category }),
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedCategory: null }),
    openDeleteModal: () => set({ isDeleteModalOpen: true }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedCategory: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    resetFilters: () => set({ ...defaultFilters }),
}));