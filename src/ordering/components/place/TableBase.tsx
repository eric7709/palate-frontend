"use client";

import { Toaster } from "sonner";
import { MenuSection } from "../menuItem/MenuSection";
import { OrderOverlays } from "./OrderOverlays";
import { useMenuItemRealtime } from "@/src/shared/hooks/useMenuItemRealtime";
import { useOrderRealtime } from "@/src/shared/hooks/useOrderRealTime";
import { RestaurantTableResponseDTO } from "@/src/tables/types";
import { useCustomerOrders, useSyncTableOrderContext } from "../../hooks/hooks.api";
import { Header } from "../shared/Header";

export  function TableBase({ tableData }: { tableData: RestaurantTableResponseDTO }) {
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