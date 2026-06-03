"use client"
import CardList from './CardList'
import Header from './Header'
import RestaurantTable from './RestaurantTable'
import AdminSearch from '../../ui/AdminSearch'
import { useTableStore } from '@/models/restaurantTable/store'
import TableFormModal from './TableFormModal'
import TableDeleteModal from './TableDeleteModal'

export default function Base() {
  const { search, setSearch } = useTableStore()
  return (
    <div className='p-3 space-y-4'>
      <Header />
      <CardList />
      <AdminSearch value={search} onChange={setSearch} />
      <TableFormModal />
      <TableDeleteModal />
      <RestaurantTable />
    </div>
  )
}
