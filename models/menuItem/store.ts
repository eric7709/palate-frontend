import { create } from "zustand";
import { MenuItemStatus, MenuItemStore } from "./types";

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
    status: null as MenuItemStatus | null,
    categoryId: null as number | null,
    isAvailable: null as boolean | null,
};

export const useMenuItemStore = create<MenuItemStore>((set) => ({
    selectedMenuItem: null,
    modal: null,
    ...defaultFilters,

    setSelectedMenuItem: (menuItem) => set({ selectedMenuItem: menuItem }),
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null, selectedMenuItem: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    setCategoryId: (categoryId) => set({ categoryId }),
    setIsAvailable: (isAvailable) => set({ isAvailable }),
    resetFilters: () => set({ ...defaultFilters }),
}));