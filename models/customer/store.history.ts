// store.history.ts — add isLoading + error fields so HistoryCardList
// can read loading state from the store rather than from the hook directly.

import { create } from "zustand";
import { CustomerOrderDTO } from "@/models/order/types";

interface OrderHistoryState {
  orders: CustomerOrderDTO[];
  isLoading: boolean;
  error: Error | null;
  setOrders: (orders: CustomerOrderDTO[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useOrderHistoryStore = create<OrderHistoryState>((set) => ({
  orders: [],
  isLoading: true,    // start as loading so the skeleton shows immediately
  error: null,
  setOrders: (orders) => set({ orders, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));