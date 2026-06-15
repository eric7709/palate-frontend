"use client"
import { useRoomStore } from '@/models/room/store'
import RoomCardList from './RoomCardList'
import Header from './Header'
import AdminSearch from '@/ui/AdminSearch'
import RoomTable from './RoomTable'
import RoomDeleteModal from './RoomDeleteModal'
import RoomFormModal from './RoomFormModal'
import HeaderWrapper from '@/ui/HeaderWrapper'

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