"use client";

import { Toaster } from "sonner";
import Header from "./Header";
import { MenuSection } from "./MenuSection";
import { OrderOverlays } from "./OrderOverlays";
import { useMenuItemRealtime } from "@/sockets/useMenuItemRealtime";
import { useOrderRealtime } from "@/sockets/useOrderRealTime";
import { useCustomerOrders, useSyncTableOrderContext } from "@/models/order/hooks";
import { RestaurantTableResponseDTO } from "@/models/restaurantTable/types";

export default function TableBase({ tableData }: { tableData: RestaurantTableResponseDTO }) {
  useMenuItemRealtime();
  useOrderRealtime();
  useCustomerOrders();
  useSyncTableOrderContext(tableData);
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors closeButton />
      <Header />
      <MenuSection />
      <OrderOverlays />
    </div>
  );
}