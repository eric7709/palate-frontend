"use client"
import CardList from '../list/CardList'
import Header from './Header'
import AdminSearch from '../../../../shared/components/input/AdminSearch'
import { useTableStore } from '@/src/tables/store'
import TableFormModal from '../management/TableFormModal'
import TableDeleteModal from '../management/TableDeleteModal'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import RestaurantTable from '../list/RestaurantTable'

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
