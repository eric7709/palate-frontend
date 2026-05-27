"use client"
import { useEffect } from 'react'
import CartPage from './CartPage'
import MenuItemList from './MenuItemList'
import Categories from './Categories'
import CustomerModal from './CustomerModal'
import { useGetTableById } from '@/models/restaurantTable/hooks'
import { useOrderRequestStore } from '@/models/orderRequest/store'
import { useCustomerStore } from '@/models/customer/store'
import Search from './Search'
import Header from './Header'
import UnavailabilityError from './UnavailabilityError'
import SuccessModal from './SuccessModal'
import { useMenuItemRealtime } from '@/models/menuItem/useMenuItemRealtime'

export default function Base({ tableId }: { tableId: string }) {
  if (!tableId) return;
  const { data } = useGetTableById(Number(tableId))
  const { setCashierId, setCustomerName, setCustomerId, setCustomerPhoneNumber, setOrderStatus, setTableId, setCustomerTitle,setWaiterId } = useOrderRequestStore()
  const { selectedCustomer } = useCustomerStore()


  useEffect(() => {
    if (data) {
      setCashierId(data.cashierId);
      setTableId(Number(tableId));
      setWaiterId(data.waiterId)
      setOrderStatus("PENDING");
    }
    if (selectedCustomer) {
      setCustomerId(selectedCustomer.id);
      setCustomerName(selectedCustomer.name);
      setCustomerTitle(selectedCustomer.title);
      setCustomerPhoneNumber(selectedCustomer.phoneNumber);
    }
  }, [selectedCustomer, data, tableId]);

  useMenuItemRealtime()
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <Categories />
      <Search />
      <CartPage />
      <UnavailabilityError />
      <SuccessModal />
      <MenuItemList />
      <CustomerModal />
    </div>
  )
}
