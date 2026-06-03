"use client"
import CardList from './CardList'
import Header from './Header'
import OrderTable from './OrderTable'
import AdminSearch from '../../ui/AdminSearch'
import { useOrderStore } from '@/models/order/store'

export default function Base() {
  const { search, setSearch } = useOrderStore()
  return (
    <div className='p-3 space-y-4'>
      <Header />
      <CardList />
      <AdminSearch value={search} onChange={setSearch} />
      <OrderTable />
    </div>
  )
}
