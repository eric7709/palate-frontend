// models/tableAllocation/store.ts
import { create } from "zustand";
import { StaffRole, TableAllocationStoreActions, TableAllocationStoreState } from "./types";


const defaultState: TableAllocationStoreState = {
  tableId: null,
  waiterId: null,
  cashierId: null,
  active: null,
  date: null,
  page: 0,
  size: 10,
  sortBy: "id",
  sortDirection: "asc",
};

export const useTableAllocationStore = create<
  TableAllocationStoreState & TableAllocationStoreActions
>((set, get) => ({
  ...defaultState,

  setTableId: (tableId) => set({ tableId }),
  setWaiterId: (waiterId) => set({ waiterId }), // clear cashier when waiter selected
  setCashierId: (cashierId) => set({ cashierId }), // clear waiter when cashier selected
  setActive: (active) => set({ active }),
  setDate: (date) => set({ date }),
  setPage: (page) => set({ page }),
  setSize: (size) => set({ size, page: 0 }), // reset to first page when size changes
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),

  resetFilters: () =>
    set({
      tableId: null,
      waiterId: null,
      cashierId: null,
      active: null,
      date: null,
      page: 0,
      size: 10,
      sortBy: "id",
      sortDirection: "asc",
    }),

  getStaffParams: () => {
    const { waiterId, cashierId } = get();
    if (waiterId) return { staffId: waiterId, role: "WAITER" as const };
    if (cashierId) return { staffId: cashierId, role: "CASHIER" as const };
    return { staffId: null, role: null };
  },
}));