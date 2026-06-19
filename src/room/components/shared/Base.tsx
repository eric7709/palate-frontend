"use client"
import { useRoomStore } from '@/src/room/store'
import AdminSearch from '@/src/shared/components/input/AdminSearch'
import HeaderWrapper from '@/src/shared/components/utils/HeaderWrapper'
import Header from './Header'
import RoomCardList from '../view/RoomCardList'
import RoomDeleteModal from '../management/RoomDeleteModal'
import RoomFormModal from '../management/RoomFormModal'
import RoomTable from '../view/RoomTable'

export default function Base() {
  const { search, setSearch } = useRoomStore()
  return (
    <div className='p-3 space-y-4'>
      <HeaderWrapper>
        <Header />
        <RoomCardList />
      </HeaderWrapper>
      <AdminSearch value={search} onChange={setSearch} />
      <RoomDeleteModal />
      <RoomFormModal />
      <RoomTable />
    </div>
  )
}