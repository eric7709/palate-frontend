import { create } from 'zustand';
import { OrderRequestDTO } from '../order/types';
import { OrderRequestStore } from './types';

const initialOrder: OrderRequestDTO = {
  orderStatus: 'PENDING',
  items: [],
};
export const useOrderRequestStore = create<OrderRequestStore>((set) => ({
  orderRequest: initialOrder,
  modal: "customer",
  setTableId: (tableId) => set((state) => ({ orderRequest: { ...state.orderRequest, tableId } })),
  setWaiterId: (waiterId) => set((state) => ({ orderRequest: { ...state.orderRequest, waiterId } })),
  setCashierId: (cashierId) => set((state) => ({ orderRequest: { ...state.orderRequest, cashierId } })),
  setOrderStatus: (orderStatus) => set((state) => ({ orderRequest: { ...state.orderRequest, orderStatus } })),
  setItems: (items) => set((state) => ({ orderRequest: { ...state.orderRequest, items } })),
  setCustomerId: (customerId) => set((state) => ({ orderRequest: { ...state.orderRequest, customerId } })),
  setCustomerName: (customerName) => set((state) => ({ orderRequest: { ...state.orderRequest, customerName } })),
  setCustomerPhoneNumber: (customerPhoneNumber) => set((state) => ({ orderRequest: { ...state.orderRequest, customerPhoneNumber } })),
  setCustomerTitle: (customerTitle) => set((state) => ({ orderRequest: { ...state.orderRequest, customerTitle } })),
  setModal: (modal) => set({ modal }),
  addItem: (newItem) => set((state) => {
    const existingItem = state.orderRequest.items.find(i => i.menuItemId === newItem.menuItemId);

    if (existingItem) {
      return {
        orderRequest: {
          ...state.orderRequest,
          items: state.orderRequest.items.map(i =>
            i.menuItemId === newItem.menuItemId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          )
        }
      };
    }
    return {
      orderRequest: { ...state.orderRequest, items: [...state.orderRequest.items, newItem] }
    };
  }),

  removeItem: (menuItemId) => set((state) => ({
    orderRequest: {
      ...state.orderRequest,
      items: state.orderRequest.items.filter(i => i.menuItemId !== menuItemId)
    }
  })),

  updateQuantity: (menuItemId, delta) => set((state) => ({
    orderRequest: {
      ...state.orderRequest,
      items: state.orderRequest.items
        .map(i => i.menuItemId === menuItemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        .filter(i => i.quantity > 0) // Remove if quantity hits 0
    }
  })),

  toggleTakeOut: (menuItemId) => set((state) => ({
    orderRequest: {
      ...state.orderRequest,
      items: state.orderRequest.items.map(i =>
        i.menuItemId === menuItemId ? { ...i, takeOut: !i.takeOut } : i
      )
    }
  })),


  setOrderDetails: (details) => set((state) => ({
    orderRequest: { ...state.orderRequest, ...details }
  })),

  resetOrder: () => set({ orderRequest: initialOrder }),
}));