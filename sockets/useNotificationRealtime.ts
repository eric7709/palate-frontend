"use client";

import { useEffect, useRef, useState } from "react";
import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";

const WS_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "DEV" || process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api/palate/ws"
    : "https://palate-backend.onrender.com/api/palate/ws";

interface Notification {
  id: number;
  title: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotificationRealtime(accountId: number | null) {
  
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accountId) return;

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

      const notificationSub = client.subscribe(
        `/user/${accountId}/queue/notifications`,
        (msg: Message) => {
          try {
            const notification: Notification = JSON.parse(msg.body);

            if (notification.type === "STALE_ORDER") {
              toast.warning(notification.title, {
                description: notification.message,
                duration: 8000,
              });
            } else {
              toast.info(notification.title, {
                description: notification.message,
                duration: 5000,
              });
            }
          } catch (e) {
            console.error("Failed to parse notification:", e);
          }
        }
      );

      subscriptionsRef.current.push(notificationSub);
    };

    client.onDisconnect = () => setIsConnected(false);
    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((s) => s.unsubscribe());
      client.deactivate();
    };
  }, [accountId]);

  return { isConnected };
}