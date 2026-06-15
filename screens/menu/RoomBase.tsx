"use client";

import { Toaster } from "sonner";
import Header from "./Header";
import { MenuSection } from "./MenuSection";
import { OrderOverlays } from "./OrderOverlays";
import { useMenuItemRealtime } from "@/sockets/useMenuItemRealtime";
import { useOrderRealtime } from "@/sockets/useOrderRealTime";
import { useCustomerOrders, useSyncRoomOrderContext } from "@/models/order/hooks";
import { RoomResponseDTO } from "@/models/room/types";

export default function RoomBase({ roomData }: { roomData: RoomResponseDTO }) {
  useMenuItemRealtime();
  useOrderRealtime();
  useCustomerOrders();
  useSyncRoomOrderContext(roomData);
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors closeButton />
      <Header />
      <MenuSection  />
      <OrderOverlays />
    </div>
  );
}