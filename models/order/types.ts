import { CustomerData } from "../customer/types";

export interface OrderResponseDTO {
  id: number;
  invoiceNumber: string;
  status: OrderStatus;
  quantity: number;
  total: number;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String

  waiter?: UserSummaryDTO | null;
  cashier: UserSummaryDTO | null;
  customer: CustomerSummaryDTO | null;
  table: TableSummaryDTO | null;
  room: RoomSummaryDTO | null; // <-- Perfectly matches your new backend Room structure
  items: OrderItemResponse[];
  virtualAccountNumber: string
  virtualBankName: string
}


export interface RoomSummaryDTO {
  id: number;
  roomNumber: string;
  floor: number | null;
}

export interface OrderHourDTO {
  hour: string;
  orders: number;
}

export interface TableAvgDTO {
  name: string;
  value: number;
}
// Nested Summary Interfaces
export interface UserSummaryDTO {
  id: number;
  fullName: string;
}

export interface CustomerSummaryDTO {
  id: number;
  name: string;
  title: string;
}

export interface TableSummaryDTO {
  id: number;
  tableNumber: number;
  tableName: string;
}

type OrderModal = "createOrder" | "deleteOrder" | "editOrder" | "viewOrder" | null;

type MenuItemStatus =
  "AVAILABLE" |
  "OUT_OF_STOCK" |
  "UNAVAILABLE" |
  "ACTIVE" |
  "INACTIVE"


export interface OrderItemResponse {
  id: number;
  menuItemName: string | null;
  menuItemId: number | null;
  quantity: number;
  price: number;
  takeOut: boolean;
}

export interface OrderStatusCounts {
  pending: number;
  preparing: number;
  completed: number;
  paid: number;
  cancelled: number;
  total: number;
}


export interface PaginatedOrderResponse {
  content: OrderResponseDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page index
  first: boolean;
  last: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CANCELLED'
  | 'PREPARING'
  | 'COMPLETED'
  | 'PAID';

export interface OrderItemDTO {
  menuItemId: number;
  name: string;      // Added for display
  price: number;     // Added for display
  quantity: number;
  status: MenuItemStatus
  takeOut: boolean;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface CustomerOrderDTO {
  items: OrderItemResponse[];  // assuming OrderItemResponseDTO is already defined
  total: number;
  quantity: number;
  invoiceNumber: string;
  virtualBankName: string;
  virtualAccountNumber: string;
  orderStatus: string;
  orderDate: string  // or use a union type: 'PENDING' | 'PREPARING' | ...
}




export interface OrderPageResponse {
  orders: PaginatedOrderResponse;
  statusCounts: OrderStatusCounts;
}


export interface OrderSummaryResponse {
  totalOrders: number;
  pending: number;
  paid: number;
  completed: number;
  cancelled: number;
  preparing: number;
  totalAmount: number;
}

export interface OrderSummaryParams {
  startDate?: string;
  endDate?: string;
  waiterId?: number;
  cashierId?: number;
}



export interface OrderFilterStoreForCahsierOrWaiter {
  startDate: string | null;
  endDate: string | null;
  waiterId: string | null
  cashierId: string | null
  status: string
}


export type OrderFilterParams = {
  page: number;
  size: number;
  search: string;
  status: OrderStatus | null;
  waiterId: number | null;
  cashierId: number | null;
  roomId: number | null; // Added
  tableId: number | null;
  minTotal: number | null;
  maxTotal: number | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};

export interface OrderStore {
  // State variables
  selectedOrder: OrderResponseDTO | null;
  modal: OrderModal;
  page: number;
  size: number;
  search: string;
  status: OrderStatus | null;
  waiterId: number | null;
  cashierId: number | null;
  roomId: number | null; // Added
  tableId: number | null;
  minTotal: number | null;
  maxTotal: number | null;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortDirection: "asc" | "desc";

  // State actions
  setSelectedOrder: (order: OrderResponseDTO | null) => void;
  setModal: (modal: OrderModal) => void;
  closeModal: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: OrderStatus | null) => void;
  setWaiterId: (id: number | null) => void;
  setCashierId: (id: number | null) => void;
  setRoomId: (id: number | null) => void; // Added
  setTableId: (id: number | null) => void;
  setMinTotal: (min: number | null) => void;
  setMaxTotal: (max: number | null) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  resetFilters: () => void;
}