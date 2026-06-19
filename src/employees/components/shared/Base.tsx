"use client"
import { useEmployeeStore } from '@/src/employees/store'
import AdminSearch from '@/src/shared/components/input/AdminSearch'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import { Header } from './Header'
import { CardList } from '../list/CardList'
import { EmployeeDeleteModal } from '../management/EmployeeDeleteModal'
import { EmployeeFormModal } from '../management/EmployeeFormModal'
import { EmployeeTable } from '../list/EmployeeTable'

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
