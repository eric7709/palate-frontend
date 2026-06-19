"use client";
import { Toaster } from "sonner";
import { MenuSection } from "../browse/MenuSection";
import { OrderOverlays } from "../create/modals/OrderOverlays";
import { useMenuItemRealtime } from "@/src/shared/hooks/useMenuItemRealtime";
import { useOrderRealtime } from "@/src/shared/hooks/useOrderRealTime";
import { RoomResponseDTO } from "@/src/room/types";
import { Header } from "./Header";
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