"use client"
import AdminSearch from '@/src/shared/components/AdminSearch'
import { useMenuItemStore } from '@/src/menuItems/store'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'
import { Header } from './Header'
import { CardList } from './CardList'
import { MenuItemFormModal } from './MenuItemFormModal'
import { MenuItemDeleteModal } from './MenuItemDeleteModal'
import { MenuItemTable } from './MenuItemTable'

export  function Base() {
  const { search, setSearch } = useMenuItemStore()
  return (
    <div className='p-4 space-y-5'>
      <HeaderWrapper>
        <Header />
        <CardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <MenuItemFormModal />
      <MenuItemDeleteModal />
      <MenuItemTable />
    </div>
  )
}
