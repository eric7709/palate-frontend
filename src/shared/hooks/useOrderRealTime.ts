"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrderStatus } from "@/src/orders";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/palate";
const WS_URL = `${API_BASE_URL}/ws`;

// Every query key that should refresh when an order is created or updated.
// If a card still doesn't refresh, add ITS query key to this list.
const QUERY_KEYS_TO_REFRESH = [
  // orders
  "orders",
  "active",
  "count",
  "analytics",
  // dashboard
  "dashboard-summary",
  "hourly-revenue",
  "quick-stats",
  "revenue-split",
  "top-menu-items",
  "top-categories",
  // add the key used by RecentOrdersCard here if it's not in the list above
  // "recent-orders",
];

const STATUS_TOAST: Record<Exclude<OrderStatus, "PENDING">, () => void> = {
  PREPARING: () =>
    toast.info("Your order is being prepared", {
      description: "Our chefs are working on your meal right now.",
      duration: 5000,
    }),
  COMPLETED: () =>
    toast.success("Your order is ready!", {
      description: "Your food is ready — it will be brought to your table shortly.",
      duration: 5000,
    }),
  PAID: () =>
    toast.success("Payment received", {
      description: "Thank you! We hope to see you again soon.",
      duration: 5000,
    }),
  CANCELLED: () =>
    toast.error("Order cancelled", {
      description: "Your order has been cancelled. Please speak to staff if this is unexpected.",
      duration: 6000,
    }),
};

export function useOrderRealtime() {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Refresh every list/card that depends on orders
    const refreshAll = () => {
      QUERY_KEYS_TO_REFRESH.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    };

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setIsConnected(false);
      },
      onWebSocketError: () => setIsConnected(false),
      onWebSocketClose: () => setIsConnected(false),
      onDisconnect: () => setIsConnected(false),
    });

    client.onConnect = () => {
      setIsConnected(true);

      // Clear old subscriptions (e.g. after a reconnect)
      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      subscriptionsRef.current = [];

      // NEW order created -> refresh everything
      const createdSub = client.subscribe("/topic/orders/created", (msg: Message) => {
        console.log("order created:", msg.body); // remove once it works
        refreshAll();
      });

      // Order status changed -> refresh everything + show toast
      const updatedSub = client.subscribe("/topic/orders/updated", (msg: Message) => {
        console.log("order updated:", msg.body); // remove once it works
        refreshAll();

        try {
          const data = JSON.parse(msg.body);
          const status = (data.status ?? data.orderStatus) as OrderStatus;
          STATUS_TOAST[status as Exclude<OrderStatus, "PENDING">]?.();
        } catch (e) {
          console.error("Failed to parse order updated:", e, msg.body);
        }
      });

      subscriptionsRef.current.push(createdSub, updatedSub);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      subscriptionsRef.current = [];
      client.deactivate();
      clientRef.current = null;
    };
  }, [queryClient]);

  return { isConnected };
}