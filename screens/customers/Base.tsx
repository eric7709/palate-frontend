"use client"
import CardList from './CardList'
import Header from './Header'
import Table from './Table'
import AdminSearch from '../../ui/AdminSearch'
import CustomerDeleteModal from './CustomerDeleteModal'
import CustomerFormModal from './CustomerFormModal'
import { useCustomerStore } from '@/models/customer/store'
import HeaderWrapper from '@/ui/HeaderWrapper'

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
      <Table />
    </div>
  )
}
