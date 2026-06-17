"use client"
import { useCategoryStore } from '@/src/categories/store'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'
import { CardList } from './CardList'
import { Header } from './Header'
import AdminSearch from '@/src/shared/components/AdminSearch'
import { CategoryFormModal } from './CategoryFormModal'
import { CategoryDeleteModal } from './CategoryDeleteModal'
import { Table } from './Table'

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