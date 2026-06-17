"use client"
import { useEmployeeStore } from '@/src/employees/store'
import AdminSearch from '@/src/shared/components/AdminSearch'
import { CardList } from './CardList'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'
import { EmployeeDeleteModal } from './EmployeeDeleteModal'
import { EmployeeFormModal } from './EmployeeFormModal'
import { EmployeeTable } from './EmployeeTable'
import { Header } from '../admin/Header'

export  function Base() {
  const { search, setSearch } = useEmployeeStore()
  return (
    <div className='p-3 space-y-4'>
      <HeaderWrapper>
        <Header />
        <CardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <EmployeeDeleteModal />
      <EmployeeFormModal />
      <EmployeeTable />
    </div>
  )
}
