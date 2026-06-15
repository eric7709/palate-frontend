"use client"
import { useEmployeeStore } from '@/models/employee/store'
import CardList from './CardList'
import Header from './Header'
import AdminSearch from '@/ui/AdminSearch'
import EmployeeTable from './EmployeeTable'
import EmployeeDeleteModal from './EmployeeDeleteModal'
import EmployeeFormModal from './EmployeeFormModal'
import HeaderWrapper from '@/ui/HeaderWrapper'

export default function Base() {
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
