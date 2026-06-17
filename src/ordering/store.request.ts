import { create } from 'zustand';
import { OrderRequestDTO, OrderRequestStore } from './types';

const initialOrder: OrderRequestDTO = {
  orderStatus: 'PENDING',
  items: [],
};


export const useOrderRequestStore = create<OrderRequestStore>((set) => ({
  orderRequest: initialOrder,
  modal: null,
  unavailableItems: [],
  setTableId: (tableId) => set((state) => ({
    orderRequest: { ...state.orderRequest, tableId }
  })),
  setWaiterId: (waiterId) => set((state) => ({
    orderRequest: { ...state.orderRequest, waiterId }
  })),
  setCashierId: (cashierId) => set((state) => ({
    orderRequest: { ...state.orderRequest, cashierId }
  })),
  setRoomId: (roomId) => set((state) => ({
    orderRequest: { ...state.orderRequest, roomId }
  })),
  setOrderStatus: (orderStatus) => set((state) => ({
    orderRequest: { ...state.orderRequest, orderStatus }
  })),
  setModal: (modal) => set({ modal }),
  setItems: (items) => set((state) => ({
    orderRequest: { ...state.orderRequest, items }
  })),
  setUnavailableItems: (items) => set({ unavailableItems: items }),
  removeFromUnavailables: (itemId) => set((state) => ({
    unavailableItems: state.unavailableItems.filter(id => id !== itemId)
  })),
  setNote: (note) => set((state) => ({
    orderRequest: { ...state.orderRequest, note }
  })),
  addItem: (newItem) => set((state) => {
    const existing = state.orderRequest.items.find(i => i.menuItemId === newItem.menuItemId);
    if (existing) {
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
      orderRequest: {
        ...state.orderRequest,
        items: [...state.orderRequest.items, newItem]
      }
    };
  }),

  removeItem: (menuItemId) => set((state) => ({
    orderRequest: {
      ...state.orderRequest,
      items: state.orderRequest.items.filter(i => i.menuItemId !== menuItemId)
    }
  })),

  updateQuantity: (menuItemId, delta) => set((state) => {
    const updatedItems = state.orderRequest.items
      .map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
      .filter(i => i.quantity > 0);
    return {
      orderRequest: { ...state.orderRequest, items: updatedItems }
    };
  }),

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

  resetOrder: () => set({ orderRequest: initialOrder, modal: null, unavailableItems: [] }),
}));