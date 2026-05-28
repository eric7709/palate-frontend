import { OrderItemDTO, OrderRequestDTO, OrderStatus } from '../order/types';




type OrderModal = "customer" | "success" | "unavailable" | "cart" | "error" | "confirm"


export interface OrderRequestStore {
  orderRequest: OrderRequestDTO;
  unavailableItems: number[];
  modal: OrderModal | null;

  setTableId: (tableId: number) => void;
  setWaiterId: (waiterId?: number) => void;
  setCashierId: (cashierId?: number) => void;
  setOrderStatus: (orderStatus: OrderStatus) => void;
  setModal: (modal: OrderModal | null) => void;
  setItems: (items: OrderItemDTO[]) => void;
  setUnavailableItems: (items: number[]) => void;
  removeFromUnavailables: (itemId: number) => void;   // ✅ single number
  setCustomerId: (customerId?: number) => void;
  setCustomerName: (customerName?: string) => void;
  setCustomerPhoneNumber: (customerPhoneNumber?: string) => void;
  setCustomerTitle: (customerTitle?: string) => void;

  addItem: (item: OrderItemDTO) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  toggleTakeOut: (menuItemId: number) => void;

  setOrderDetails: (details: Partial<OrderRequestDTO>) => void;
  resetOrder: () => void;
}