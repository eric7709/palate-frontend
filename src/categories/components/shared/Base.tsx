"use client"
import { useCategoryStore } from '@/src/categories/store'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import { CardList } from '../list/CardList'
import { Header } from './Header'
import AdminSearch from '@/src/shared/components/input/AdminSearch'
import { CategoryFormModal } from '../management/CategoryFormModal'
import { CategoryDeleteModal } from '../management/CategoryDeleteModal'
import { Table } from '../list/Table'

export function Base() {
  const { setSearch, search } = useCategoryStore()
  return (
    <div className='p-4 space-y-4'>
      <HeaderWrapper>
        <Header />
        <CardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <CategoryFormModal />
      <CategoryDeleteModal />
      <Table />
    </div>
  )
}