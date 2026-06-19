"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrderStatus } from "@/src/orders";

const WS_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws` || "http://localhost:8080/api/palate/ws";

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
    if (clientRef.current) {
      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      clientRef.current.deactivate();
    }

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
    });

    client.onConnect = () => {
      setIsConnected(true);

      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      subscriptionsRef.current = [];

      const createdSub = client.subscribe("/topic/orders/created", (msg: Message) => {
        try {
          JSON.parse(msg.body);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
          queryClient.invalidateQueries({ queryKey: ["active"] });
          queryClient.invalidateQueries({ queryKey: ["count"] });
        } catch (e) {
          console.error("Failed to parse order created:", e);
        }
      });
      subscriptionsRef.current.push(createdSub);

      const updatedSub = client.subscribe("/topic/orders/updated", (msg: Message) => {
        try {
          const data = JSON.parse(msg.body);
          const id = data.id ?? data.orderId;
          const status = (data.status ?? data.orderStatus) as OrderStatus;

          // Core orders and system lookups
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["active"] });
          queryClient.invalidateQueries({ queryKey: ["count"] });

          // Your specific dashboard layout queries
          queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
          queryClient.invalidateQueries({ queryKey: ["hourly-revenue"] });
          queryClient.invalidateQueries({ queryKey: ["quick-stats"] });
          queryClient.invalidateQueries({ queryKey: ["revenue-split"] });
          queryClient.invalidateQueries({ queryKey: ["top-menu-items"] });
          queryClient.invalidateQueries({ queryKey: ["top-categories"] });

          // Your specific analytics queries
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
          STATUS_TOAST[status as Exclude<OrderStatus, "PENDING">]?.();
        } catch (e) {
          console.error("Failed to parse order updated:", e);
          console.error("Raw body:", msg.body);
        }
      });
      subscriptionsRef.current.push(updatedSub);
    };

    client.onDisconnect = () => setIsConnected(false);
    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      client.deactivate();
    };
  }, [queryClient]);

  return { isConnected };
}