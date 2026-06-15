// Request DTO
export interface RestaurantTableRequestDTO {
  tableName: string;
  tableNumber: number;
  status?: string;
  capacity?: number;
}

export type RestaurantTableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE" | "UNAVAILABLE";


// Response DTO
export interface RestaurantTableResponseDTO {
  id: number;
  tableName: string;
  tableNumber: number;
  status: RestaurantTableStatus;
  qrCode: string
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

type TableModal = "createTable" | "deleteTable" | "editTable";

export interface TableStore {
    selectedTable: RestaurantTableResponseDTO | null;
    modal: TableModal | null;

    page: number;
    size: number;
    search: string;
    status: string;

    setSelectedTable: (table: RestaurantTableResponseDTO | null) => void;
    setModal: (modal: TableModal | null) => void;
    closeModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    setStatus: (status: string) => void;
    resetFilters: () => void;
}