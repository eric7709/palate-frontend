"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import CartPage from "./CartPage";
import MenuItemList from "./MenuItemList";
import Categories from "./Categories";
import CustomerModal from "./CustomerModal";
import { useGetTableById } from "@/models/restaurantTable/hooks";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useCustomerStore } from "@/models/customer/store";
import Search from "./Search";
import Header from "./Header";
import UnavailabilityError from "./UnavailabilityError";
import SuccessModal from "./SuccessModal";
import { useMenuItemRealtime } from "@/models/menuItem/useMenuItemRealtime";
import ConfirmModal from "./ConfirmModal";
import { useGetAllMenuItems } from "@/models/menuItem/hooks";
import { useGetAllCategories } from "@/models/category/hooks";
import { useMenuItemStore } from "@/models/menuItem/store";
import HistoryPage from "./HistoryPage";
import { useOrderRealtime } from "@/models/order/useOrderRealTime";
import { useCustomerOrders } from "@/models/order/hooks";

export default function Base({ tableId }: { tableId: string }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useMenuItemRealtime();
  useOrderRealtime()
  useCustomerOrders()
  if (!tableId) return null;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { search, categoryId } = useMenuItemStore();
  const { data: menuItemsData, isLoading: menuLoading } = useGetAllMenuItems({ search, categoryId });
  const { data: categoriesData } = useGetAllCategories({});
  const { data: tableData } = useGetTableById(Number(tableId));

  const {
    setCashierId,
    setCustomerName,
    setCustomerId,
    setCustomerPhoneNumber,
    setOrderStatus,
    setTableId,
    setCustomerTitle,
    setWaiterId,
  } = useOrderRequestStore();

  const { selectedCustomer } = useCustomerStore();

  useEffect(() => {
    if (!tableData) return;
    setCashierId(tableData.cashierId);
    setTableId(Number(tableId));
    setWaiterId(tableData.waiterId);
    setOrderStatus("PENDING");
  }, [tableData, tableId, setCashierId, setTableId, setWaiterId, setOrderStatus]);

  useEffect(() => {
    if (!selectedCustomer) return;
    setCustomerId(selectedCustomer.id);
    setCustomerName(selectedCustomer.name);
    setCustomerTitle(selectedCustomer.title);
    setCustomerPhoneNumber(selectedCustomer.phoneNumber);
  }, [selectedCustomer, setCustomerId, setCustomerName, setCustomerTitle, setCustomerPhoneNumber]);

  if (!isHydrated) {
    return (
      <div className="flex bg-white h-screen justify-center items-center">
        <div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  const menuItems = menuItemsData?.content ?? [];
  const hasNoResults = !menuLoading && menuItems.length === 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Toast notifications for order status changes */}
      <Toaster position="top-center" richColors closeButton />

      <Header />
      <Categories categories={categoriesData?.content ?? []} />
      <Search />

      {/* Modals & overlays */}
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerModal />

      {/* Menu content */}
      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <p className="text-gray-400 text-lg font-medium">No menu items found</p>
          <p className="text-gray-300 text-sm mt-1">
            {search
              ? `No results for "${search}"`
              : "No items available in this category"}
          </p>
        </div>
      ) : (
        <MenuItemList items={menuItems} />
      )}
    </div>
  );
}