"use client"
import CardList from './CardList'
import Header from './Header'
import Table from './Table'
import AdminSearch from '../../ui/AdminSearch'
import { useCategoryStore } from '@/models/category/store'
import CategoryFormModal from './CategoryFormModal'
import CategoryDeleteModal from './CategoryDeleteModal'
import HeaderWrapper from '@/ui/HeaderWrapper'

export default function Base() {
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