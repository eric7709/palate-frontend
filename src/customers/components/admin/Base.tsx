"use client"
import CardList from './CardList'
import Header from './Header'
import AdminSearch from '../../../shared/components/AdminSearch'
import CustomerDeleteModal from './CustomerDeleteModal'
import CustomerFormModal from './CustomerFormModal'
import { useCustomerStore } from '@/src/customers/store'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'
import CustomerTable from './CustomerTable'

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
