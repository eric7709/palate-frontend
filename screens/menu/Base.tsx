"use client";

import { useEffect } from "react";
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
import { useMenuItemRealtime } from "@/sockets/useMenuItemRealtime";
import ConfirmModal from "./ConfirmModal";
import { useGetAllMenuItems } from "@/models/menuItem/hooks";
import { useGetAllCategories } from "@/models/category/hooks";
import { useMenuItemStore } from "@/models/menuItem/store";
import HistoryPage from "./HistoryPage";
import { useOrderRealtime } from "@/sockets/useOrderRealTime";
import { useCustomerOrders } from "@/models/order/hooks";
import { TableUnavailable } from "@/ui/TableUnavailable";
import CategorySkeleton from "./CategorySkeleton";
import { MenuSkeleton } from "./MenuItemSkeleton";


export default function Base({ tableId }: { tableId: string }) {
  // ✅ All hooks at the top — no early returns before this point
  useMenuItemRealtime();
  useOrderRealtime();
  useCustomerOrders();

  const { search, categoryId } = useMenuItemStore();
  const { data: menuItemsData, isLoading: menuLoading } = useGetAllMenuItems({ search, categoryId });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories({});
  const { data: tableData, isLoading: tableLoading } = useGetTableById(tableId ? Number(tableId) : undefined);

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

  // ✅ All conditional returns after hooks
  if (!tableId) return null;

  if (tableLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategorySkeleton />
        <MenuSkeleton />
      </div>
    );
  }

  if (!tableData?.cashierId || !tableData?.waiterId) {
    return (
      <TableUnavailable
        tableName={tableData?.tableName}
        tableNumber={tableData?.tableNumber}
      />
    );
  }

  const menuItems = menuItemsData?.content ?? [];
  const hasNoResults = !menuLoading && menuItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors closeButton />
      <Header />

      {categoriesLoading ? (
        <CategorySkeleton />
      ) : (
        <Categories categories={categoriesData?.content ?? []} />
      )}

      <Search />
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerModal />

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