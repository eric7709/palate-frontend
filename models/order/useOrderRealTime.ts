"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = "http://localhost:8080/api/palate/ws"; // ✅ Stable module-level constant

export function useOrderRealtime() {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscriptions: StompSubscription[] = [];

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL), // ✅ No /ws suffix — consistent with your menu hook
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      },
      onWebSocketClose: () => setIsConnected(false),
    });

    client.onConnect = () => {
      setIsConnected(true);

      subscriptions.push(
        client.subscribe("/topic/orders/created", (msg: Message) => {
          try {
            JSON.parse(msg.body); // parse only if you need the order data downstream
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
          } catch (e) {
            console.error("Failed to parse order created message:", e);
          }
        }),

        client.subscribe("/topic/orders/updated", (msg: Message) => {
          try {
            const { id } = JSON.parse(msg.body);
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", id] }); // ✅ Invalidate specific order too
            queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
          } catch (e) {
            console.error("Failed to parse order updated message:", e);
          }
        })
      );
    };

    client.onDisconnect = () => setIsConnected(false);
    client.activate();
    clientRef.current = client;

    return () => {
      subscriptions.forEach((s) => s.unsubscribe()); // ✅ Clean up subscriptions first
      client.deactivate();
    };
  }, [queryClient]);

  return { isConnected };
}