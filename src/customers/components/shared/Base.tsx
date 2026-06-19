"use client"
import CardList from '../list/CardList'
import Header from './Header'
import AdminSearch from '../../../shared/components/input/AdminSearch'
import CustomerDeleteModal from '../management/CustomerDeleteModal'
import CustomerFormModal from '../management/CustomerFormModal'
import { useCustomerStore } from '@/src/customers/store'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import CustomerTable from '../list/CustomerTable'

export default function Base() {
  const { setSearch, search } = useCustomerStore()
  return (
    <div className='p-3 space-y-4'>
      <HeaderWrapper>
        <Header />
        <CardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <CustomerDeleteModal />
      <CustomerFormModal />
      <CustomerTable />
    </div>
  )
}
