import { create } from "zustand";
import { OrderStore } from "./types";

const getToday = () => new Date().toISOString().split('T')[0];

const defaultFilters = {
    page: 0,
    size: 30,
    search: "",
    status: null,
    waiterId: null,
    cashierId: null,
    tableId: null,
    minTotal: null,
    maxTotal: null,
    startDate: getToday(),
    endDate: getToday(),
    sortBy: "id",
    sortDirection: "desc" as const,
};


export const useOrderStore = create<OrderStore>((set) => ({
    selectedOrder: null,
    isFormOpen: false,
    isDeleteModalOpen: false,
    ...defaultFilters,
    setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedOrder: null }),
    openDeleteModal: () => set({ isDeleteModalOpen: true }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedOrder: null }),
    setPage: (page) => set({ page }),
    setSize: (size) => set({ size }),
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    setWaiterId: (waiterId) => set({ waiterId }),
    setCashierId: (cashierId) => set({ cashierId }),
    setTableId: (tableId) => set({ tableId }),
    setMinTotal: (minTotal) => set({ minTotal }),
    setMaxTotal: (maxTotal) => set({ maxTotal }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortDirection: (sortDirection) => set({ sortDirection }),
    resetFilters: () => set({ ...defaultFilters }),
}));



