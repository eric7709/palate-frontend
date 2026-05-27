"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = "http://localhost:8080/api/palate/ws";

export function useMenuItemRealtime() {
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup previous client if any
    if (clientRef.current) {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      clientRef.current.deactivate();
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.debug("[STOMP]", str), // enable debug logs
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setLastError(frame.headers?.message || "STOMP error");
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        setLastError("WebSocket connection failed");
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        console.log("WebSocket closed");
        setIsConnected(false);
      },
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
      setLastError(null);

      // Unsubscribe any previous subscriptions (safety)
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];

      // Subscribe to each topic
      const createdSub = client.subscribe("/topic/menuItems/created", (msg: Message) => {
        console.log("📢 MenuItem created:", msg.body);
        queryClient.invalidateQueries({ queryKey: ["menu-items"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      });
      subscriptionsRef.current.push(createdSub);

      const updatedSub = client.subscribe("/topic/menuItems/updated", (msg: Message) => {
        console.log("✏️ MenuItem updated:", msg.body);
        try {
          const { id } = JSON.parse(msg.body);
          queryClient.invalidateQueries({ queryKey: ["menu-items"] });
          queryClient.invalidateQueries({ queryKey: ["menu-items", id] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        } catch (e) {
          console.error("Failed to parse update message:", e);
        }
      });
      subscriptionsRef.current.push(updatedSub);

      const deletedSub = client.subscribe("/topic/menuItems/deleted", (msg: Message) => {
        console.log("🗑️ MenuItem deleted:", msg.body);
        const deletedId = Number(msg.body);
        queryClient.invalidateQueries({ queryKey: ["menu-items"] });
        queryClient.invalidateQueries({ queryKey: ["menu-items", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      });
      subscriptionsRef.current.push(deletedSub);
    };

    client.onDisconnect = () => {
      console.log("🔌 Disconnected from WebSocket");
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      client.deactivate();
    };
  }, [queryClient]); // queryClient is stable

  return { isConnected, lastError };
}