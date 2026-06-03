"use client"
import AdminSearch from '@/ui/AdminSearch'
import MenuItemCardList from './CardList'
import Header from './Header'
import MenuItemDeleteModal from './MenuItemDeleteModal'
import MenuItemFormModal from './MenuItemFormModal'
import MenuItemTable from './MenuItemTable'
import { useMenuItemStore } from '@/models/menuItem/store'

export default function Base() {
  const { search, setSearch } = useMenuItemStore()
  return (
    <div className='p-4 space-y-5'>
      <Header />
      <MenuItemCardList />
      <AdminSearch value={search} onChange={setSearch} />
      <MenuItemFormModal />
      <MenuItemDeleteModal />
      <MenuItemTable />
    </div>
  )
}
