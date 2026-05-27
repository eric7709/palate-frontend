import { create } from "zustand";
import { MenuItemStore } from "./types";



const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
    status: "",
    categoryId: null,
    isAvailable: null,
};

export const useMenuItemStore = create<MenuItemStore>((set) => ({
    selectedMenuItem: null,
    isFormOpen: false,
    isDeleteModalOpen: false,
    ...defaultFilters,

    setSelectedMenuItem: (menuItem) => set({ selectedMenuItem: menuItem }),
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedMenuItem: null }),
    openDeleteModal: () => set({ isDeleteModalOpen: true }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedMenuItem: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    setCategoryId: (categoryId) => set({ categoryId }),
    setIsAvailable: (isAvailable) => set({ isAvailable }),
    resetFilters: () => set({ ...defaultFilters }),
}));