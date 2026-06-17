"use client"
import CardList from './CardList'
import Header from './Header'
import RestaurantTable from './RestaurantTable'
import AdminSearch from '../../../shared/components/AdminSearch'
import { useTableStore } from '@/src/tables/store'
import TableFormModal from './TableFormModal'
import TableDeleteModal from './TableDeleteModal'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'

export default function Base() {
  const { search, setSearch } = useTableStore()
  return (
    <div className='p-3 space-y-4'>
      <HeaderWrapper>
        <Header />
        <CardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <TableFormModal />
      <TableDeleteModal />
      <RestaurantTable />
    </div>
  )
}
