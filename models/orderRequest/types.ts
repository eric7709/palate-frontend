import { OrderItemDTO, OrderStatus } from '../order/types';




type OrderModal = "customer" | "success" | "unavailable" | "cart" | "error" | "confirm" | "history"


export interface OrderRequestDTO {
  tableId?: number | null;
  roomId?: number | null;
  waiterId?: number | null;
  cashierId?: number | null;
  orderStatus: OrderStatus;
  items: OrderItemDTO[];
  customerId?: number;
  customerName?: string;
  customerPhoneNumber?: string;
  customerTitle?: string;
}

export interface OrderRequestStore {
  orderRequest: OrderRequestDTO;
  unavailableItems: number[];
  modal: OrderModal | null;

  setTableId: (tableId: number) => void;
  setWaiterId: (waiterId?: number) => void;
  setCashierId: (cashierId?: number) => void;
  setRoomId: (roomId?: number) => void;
  setOrderStatus: (orderStatus: OrderStatus) => void;
  setModal: (modal: OrderModal | null) => void;
  setItems: (items: OrderItemDTO[]) => void;
  setUnavailableItems: (items: number[]) => void;
  removeFromUnavailables: (itemId: number) => void;   // ✅ single number
  addItem: (item: OrderItemDTO) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  toggleTakeOut: (menuItemId: number) => void;

  setOrderDetails: (details: Partial<OrderRequestDTO>) => void;
  resetOrder: () => void;
}