// Request DTO
export interface RestaurantTableRequestDTO {
  tableName: string;
  tableNumber: number;
  waiterId?: number;
  cashierId?: number;
  status?: string;
  capacity?: number;
}

// Response DTO
export interface RestaurantTableResponseDTO {
  id: number;
  tableName: string;
  tableNumber: number;
  status: string;
  capacity?: number;
  waiterName?: string;
  waiterId?: number;
  cashierName?: string;
  cashierId?: number;
}
export interface RestaurantTopTableDTO {
  tableId: number;
  tableName: string;
  tableNumber: string; // Keep as string to match your Java DTO definition
  totalSales: number;
}

export interface TableStore {
    selectedTable: RestaurantTableResponseDTO | null;
    isFormOpen: boolean;
    isDeleteModalOpen: boolean;

    // Pagination & filters
    page: number;
    size: number;
    search: string;
    status: string;

    setSelectedTable: (table: RestaurantTableResponseDTO | null) => void;
    openForm: () => void;
    closeForm: () => void;
    openDeleteModal: () => void;
    closeDeleteModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
}
