"use client"
import AdminSearch from '@/src/shared/components/input/AdminSearch'
import { useMenuItemStore } from '@/src/menuItems/store'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import { Header } from './Header'
import { CardList } from '../list/CardList'
import { MenuItemFormModal } from '../management/MenuItemFormModal'
import { MenuItemDeleteModal } from '../management/MenuItemDeleteModal'
import { MenuItemTable } from '../list/MenuItemTable'

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
