import { create } from "zustand";
import { TableStore } from "./types";

export const useTableStore = create<TableStore>((set) => ({
    selectedTable: null,
    isFormOpen: false,
    isDeleteModalOpen: false,

    page: 0,
    size: 50,
    search: "",
    status: "",

    setSelectedTable: (table) => set({ selectedTable: table }),
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedTable: null }),
    openDeleteModal: () => set({ isDeleteModalOpen: true }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedTable: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
}));