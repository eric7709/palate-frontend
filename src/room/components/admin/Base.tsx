"use client"
import { useRoomStore } from '@/src/room/store'
import RoomCardList from './RoomCardList'
import Header from './Header'
import AdminSearch from '@/src/shared/components/AdminSearch'
import RoomDeleteModal from './RoomDeleteModal'
import RoomFormModal from './RoomFormModal'
import HeaderWrapper from '@/src/shared/components/HeaderWrapper'
import RoomTable from './RoomTable'

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