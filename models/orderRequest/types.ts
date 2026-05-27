import { OrderItemDTO, OrderRequestDTO, OrderStatus } from '../order/types';




type OrderModal = "customer" | "success" | "unavailable" | "cart" | "error"

export interface OrderRequestStore {
  orderRequest: OrderRequestDTO;
  modal: OrderModal | null
  // Individual setters
  setTableId: (tableId: number) => void;
  setWaiterId: (waiterId?: number) => void;
  setCashierId: (cashierId?: number) => void;
  setOrderStatus: (orderStatus: OrderStatus) => void;
  setModal: (modal: OrderModal | null) => void;
  setItems: (items: any[]) => void;
  setCustomerId: (customerId?: number) => void;
  setCustomerName: (customerName?: string) => void;
  setCustomerPhoneNumber: (customerPhoneNumber?: string) => void;
  setCustomerTitle: (customerTitle?: string) => void;

  addItem: (item: OrderItemDTO) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  toggleTakeOut: (menuItemId: number) => void;
  
  // Helper for batch updates
  setOrderDetails: (details: Partial<OrderRequestDTO>) => void;
  resetOrder: () => void;
}

