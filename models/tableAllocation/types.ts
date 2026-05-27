export interface StaffSummaryDTO {
    id: number;
    fullName: string;
}

export interface TableAllocationResponseDTO {
    id: number;
    cashier?: StaffSummaryDTO;
    cashierAllocatedAt?: string;
    cashierDeallocatedAt?: string;
    waiter?: StaffSummaryDTO;
    waiterAllocatedAt?: string;
    waiterDeallocatedAt?: string;
}

export interface TableAllocationRequestDTO {
    tableId: number;
    staffId: number; // Used for allocate/deallocate endpoints
}

// Params for the paginated GET endpoint
export interface AllocationParams {
    tableId?: number;
    staffId?: number;
    role?: string;
    active?: boolean;
    date?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}