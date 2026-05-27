"use client"
import { useOrderWebSocket } from "@/models/order/socket";
import { OrderResponseDTO } from "@/models/order/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface OrderContextValue {
  orders: OrderResponseDTO[];
  connected: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextValue | null>(null);

interface OrderProviderProps {
  children: ReactNode;
  customerId?: number | null;
  subscribeGlobal?: boolean;
  token?: string;
}

export function OrderProvider({
  children,
  customerId = null,
  subscribeGlobal = false,
  token,
}: OrderProviderProps) {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);

  const { connected, error } = useOrderWebSocket<OrderResponseDTO>({
    baseUrl: "http://localhost:8080",  // default Spring Boot port
    customerId,
    subscribeGlobal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    onOrderCreated: (order) => {
      setOrders((prev) => [order, ...prev]);
      console.log("OK WS RAN")
    },
    onOrderUpdated: (order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    },
  });

  return (
    <OrderContext.Provider value={{ orders, connected, error }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrderProvider>");
  return ctx;
}