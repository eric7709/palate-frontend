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

function CategorySkeleton() {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 w-20 rounded-full bg-gray-100 animate-pulse shrink-0" />
      ))}
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-3 animate-pulse">
          {/* Icon placeholder */}
          <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
          {/* Text */}
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
          {/* Button */}
          <div className="w-16 h-9 bg-gray-200 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function Base({ tableId }: { tableId: string }) {
  useMenuItemRealtime();
  useOrderRealtime();
  useCustomerOrders();

  if (!tableId) return null;

  const { search, categoryId } = useMenuItemStore();
  const { data: menuItemsData, isLoading: menuLoading } = useGetAllMenuItems({ search, categoryId });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories({});
  const { data: tableData } = useGetTableById(Number(tableId));

  const {
    setCashierId, setCustomerName, setCustomerId,
    setCustomerPhoneNumber, setOrderStatus,
    setTableId, setCustomerTitle, setWaiterId,
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

  const menuItems = menuItemsData?.content ?? [];
  const hasNoResults = !menuLoading && menuItems.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors closeButton />

      <Header />

      {/* Categories */}
      {categoriesLoading ? (
        <CategorySkeleton />
      ) : (
        <Categories categories={categoriesData?.content ?? []} />
      )}

      <Search />

      {/* Modals */}
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerModal />

      {/* Menu */}
      {menuLoading ? (
        <MenuSkeleton />
      ) : hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <p className="text-gray-400 text-lg font-medium">No menu items found</p>
          <p className="text-gray-300 text-sm mt-1">
            {search ? `No results for "${search}"` : "No items available in this category"}
          </p>
        </div>
      ) : (
        <MenuItemList items={menuItems} />
      )}
    </div>
  );
}