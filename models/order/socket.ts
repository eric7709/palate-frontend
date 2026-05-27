import { Client, Frame, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// 1. Define strict Type Interfaces matching your Spring Boot Backend DTOs
export interface CustomerDTO {
    id: number;
    name?: string;
    email?: string;
}

export interface OrderResponseDTO {
    id: number;
    status: string;
    totalPrice: number;
    customer: CustomerDTO;
    items?: Array<{
        id: number;
        name: string;
        quantity: number;
    }>;
}

// 2. Configuration Constants
const BACKEND_URL: string = 'http://localhost:8080/api/palate/ws'; 
const CUSTOMER_ID: number = 42; // Replace with your dynamic user session ID

// 3. Initialize the STOMP Client with explicit typing
const stompClient: Client = new Client({
    // Type-safe factory wrapper for SockJS fallback
    webSocketFactory: (): WebSocket => new SockJS(BACKEND_URL) as WebSocket,
    
    debug: (str: string): void => {
        console.log('STOMP Debug: ' + str);
    },
    
    reconnectDelay: 5000, 
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

// 4. Define Connection Lifecycle Hook
stompClient.onConnect = (frame: Frame): void => {
    console.log('Connected to STOMP Broker over SockJS! ' + frame);

    // 🔊 Global Subscription: Order Created
    stompClient.subscribe('/topic/orders/created', (message: IMessage): void => {
        try {
            const newOrder: OrderResponseDTO = JSON.parse(message.body);
            console.log('🎉 New Order Created globally:', newOrder);
            // Handle your global UI notification or state management here
        } catch (error) {
            console.error('Failed to parse created order payload:', error);
        }
    });

    // 🔊 Global Subscription: Order Updated
    stompClient.subscribe('/topic/orders/updated', (message: IMessage): void => {
        try {
            const updatedOrder: OrderResponseDTO = JSON.parse(message.body);
            console.log('🔄 An order was updated globally:', updatedOrder);
        } catch (error) {
            console.error('Failed to parse updated order payload:', error);
        }
    });

    // 🎯 Customer-Specific Subscription
    if (CUSTOMER_ID) {
        stompClient.subscribe(`/topic/orders/customer/${CUSTOMER_ID}`, (message: IMessage): void => {
            try {
                const customerOrderUpdate: OrderResponseDTO = JSON.parse(message.body);
                console.log(`👤 Personal Order Update for Customer ${CUSTOMER_ID}:`, customerOrderUpdate);
                alert(`Your order status is now: ${customerOrderUpdate.status}`);
            } catch (error) {
                console.error('Failed to parse customer order payload:', error);
            }
        });
    }
};

// 5. Error Handling Hook
stompClient.onStompError = (frame: Frame): void => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

// 6. Fire up the connection
stompClient.activate();

// 💡 Bonus: Type-safe outbound publisher function
export function sendMessageToServer<T>(destination: string, data: T): void {
    if (!stompClient.connected) {
        console.warn('Cannot send message. STOMP client is not connected.');
        return;
    }
    stompClient.publish({
        destination: `/app/${destination}`,
        body: JSON.stringify(data)
    });
}