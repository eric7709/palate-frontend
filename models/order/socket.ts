"use client";
import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const WS_URL = `${API_BASE}/api/palate/ws`;

export function useStaffOrderUpdates(onOrderReceived: (order: any) => void) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      // We use the dynamic WS_URL constructed above
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        console.log('Staff Connected to Live Orders');

        client.subscribe('/topic/orders/created', (msg) => {
          onOrderReceived(JSON.parse(msg.body));
        });

        client.subscribe('/topic/orders/updated', (msg) => {
          onOrderReceived(JSON.parse(msg.body));
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [onOrderReceived]);

  return { connected };
}