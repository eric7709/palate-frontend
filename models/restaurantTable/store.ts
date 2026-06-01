import { create } from "zustand";
import { TableStore } from "./types";

type TableModal = "createTable" | "deleteTable" | "editTable";

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
    status: "",
};

export const useTableStore = create<TableStore>((set) => ({
    selectedTable: null,
    modal: null,
    ...defaultFilters,

    setSelectedTable: (table) => set({ selectedTable: table }),
    setModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null, selectedTable: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    resetFilters: () => set({ ...defaultFilters }),
}));