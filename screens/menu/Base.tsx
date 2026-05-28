"use client";
import { useEffect } from 'react';
import CartPage from './CartPage';
import MenuItemList from './MenuItemList';
import Categories from './Categories';
import CustomerModal from './CustomerModal';
import { useGetTableById } from '@/models/restaurantTable/hooks';
import { useOrderRequestStore } from '@/models/orderRequest/store';
import { useCustomerStore } from '@/models/customer/store';
import Search from './Search';
import Header from './Header';
import UnavailabilityError from './UnavailabilityError';
import SuccessModal from './SuccessModal';
import { useMenuItemRealtime } from '@/models/menuItem/useMenuItemRealtime';
import ConfirmModal from './ConfirmModal';
import { useGetAllMenuItems } from '@/models/menuItem/hooks';
import { useGetAllCategories } from '@/models/category/hooks';
import { useMenuItemStore } from '@/models/menuItem/store';
import Loader from '@/ui/Loader';

export default function Base({ tableId }: { tableId: string }) {
  if (!tableId) return null;

  const { search, categoryId } = useMenuItemStore();
  const { data: menuItemsData, isLoading: menuLoading } = useGetAllMenuItems({ search, categoryId });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories({});
  const { data: tableData } = useGetTableById(Number(tableId));
  const { setCashierId, setCustomerName, setCustomerId, setCustomerPhoneNumber, setOrderStatus, setTableId, setCustomerTitle, setWaiterId } = useOrderRequestStore();
  const { selectedCustomer } = useCustomerStore();

  useEffect(() => {
    if (tableData) {
      setCashierId(tableData.cashierId);
      setTableId(Number(tableId));
      setWaiterId(tableData.waiterId);
      setOrderStatus("PENDING");
    }
    if (selectedCustomer) {
      setCustomerId(selectedCustomer.id);
      setCustomerName(selectedCustomer.name);
      setCustomerTitle(selectedCustomer.title);
      setCustomerPhoneNumber(selectedCustomer.phoneNumber);
    }
  }, [selectedCustomer, tableData, tableId, setCashierId, setTableId, setWaiterId, setOrderStatus, setCustomerId, setCustomerName, setCustomerTitle, setCustomerPhoneNumber]);

  useMenuItemRealtime();

  // Show loader while either menu items or categories are still loading
  if (menuLoading || categoriesLoading) {
    return <div className="flex bg-white h-screen z-5000 pb-10 justify-center items-center">
      <div
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Categories categories={categoriesData?.content || []} />
      <Search />
      <CartPage />
      <ConfirmModal />
      <UnavailabilityError />
      <SuccessModal />
      <MenuItemList items={menuItemsData?.content || []} />
      <CustomerModal />
    </div>
  );
}