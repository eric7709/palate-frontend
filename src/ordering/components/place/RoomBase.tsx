"use client";
import { Toaster } from "sonner";
import { MenuSection } from "../menuItem/MenuSection";
import { OrderOverlays } from "./OrderOverlays";
import { useMenuItemRealtime } from "@/src/shared/hooks/useMenuItemRealtime";
import { useOrderRealtime } from "@/src/shared/hooks/useOrderRealTime";
import { RoomResponseDTO } from "@/src/room/types";
import { Header } from "../shared/Header";
import { useCustomerOrders, useSyncRoomOrderContext } from "../../hooks/hooks.api";

export  function RoomBase({ roomData }: { roomData: RoomResponseDTO }) {
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