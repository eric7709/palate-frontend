// types/tableAllocation.ts
export interface StaffSummaryDTO {
  id: number;
  fullName: string;
}

export interface TableAllocationResponseDTO {
  id: number;
  cashier: StaffSummaryDTO | null;
  cashierAllocatedAt: string | null;   // ISO date string
  cashierDeallocatedAt: string | null;
  waiter: StaffSummaryDTO | null;
  waiterAllocatedAt: string | null;
  waiterDeallocatedAt: string | null;
}

export interface TableAllocationRequestDTO {
    tableId: number;
    staffId: number; // Used for allocate/deallocate endpoints
}
// types/tableAllocationFilters.ts

export type StaffRole = "CASHIER" | "WAITER" | null;

export interface TableAllocationFilters {
  tableId: number | null;
  staffId: number | null;
  role: StaffRole;
  active: boolean | null;
  date: string | null; // ISO date string (YYYY-MM-DD)
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface TableAllocationStoreState {
  // Filters
  tableId: number | null;
  waiterId: number | null;
  cashierId: number | null;
  active: boolean | null;
  date: string | null;
  // Pagination
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface TableAllocationStoreActions {
  setTableId: (id: number | null) => void;
  setWaiterId: (id: number | null) => void;
  setCashierId: (id: number | null) => void;
  setActive: (active: boolean | null) => void;
  setDate: (date: string | null) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  resetFilters: () => void;
  // Helper to get backend‑ready staffId + role from waiterId/cashierId
  getStaffParams: () => { staffId: number | null; role: StaffRole };
}
