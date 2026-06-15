import { create } from "zustand";
import { OrderStore } from "./types";

const getToday = (): string => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' });
};

const defaultFilters = {
  page: 0,
  size: 30,
  search: "",
  status: null,
  waiterId: null,
  cashierId: null,
  roomId: null, // Added
  tableId: null,
  minTotal: null,
  maxTotal: null,
  sortBy: "id",
  sortDirection: "desc" as const,
};

export const useOrderStore = create<OrderStore>((set) => ({
  // --- Initial States ---
  selectedOrder: null,
  modal: null,
  ...defaultFilters,
  startDate: getToday(),
  endDate: getToday(),

  // --- Core Layout View Actions ---
  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  setModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null, selectedOrder: null }),

  // --- Pagination & Filters Control ---
  setPage: (page) => set({ page }),
  setSize: (size) => set({ size }),
  setSearch: (search) => set({ search, page: 0 }),
  setStatus: (status) => set({ status, page: 0 }),
  setWaiterId: (waiterId) => set({ waiterId, page: 0 }),
  setCashierId: (cashierId) => set({ cashierId, page: 0 }),
  
  // Setting a Room clears out the active Table constraint context
  setRoomId: (roomId) => set({ roomId, tableId: null, page: 0 }),
  
  // Setting a Table clears out the active Room constraint context
  setTableId: (tableId) => set({ tableId, roomId: null, page: 0 }),
  
  setMinTotal: (minTotal) => set({ minTotal, page: 0 }),
  setMaxTotal: (maxTotal) => set({ maxTotal, page: 0 }),
  setStartDate: (startDate) => set({ startDate, page: 0 }),
  setEndDate: (endDate) => set({ endDate, page: 0 }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  
  resetFilters: () => set({ 
    ...defaultFilters, 
    startDate: getToday(), 
    endDate: getToday() 
  }),
}));