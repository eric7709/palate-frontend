"use client"

import { useDeleteRoom } from '@/models/room/hooks'
import { useRoomStore } from '@/models/room/store'
import DeleteModal from '@/ui/DeleteModal'
import { toast } from 'sonner'

export default function RoomDeleteModal() {
  const { modal, selectedRoom, setSelectedRoom, closeModal } = useRoomStore()
  const { mutate, isPending: isDeleting } = useDeleteRoom()

  const handleDelete = () => {
    if (selectedRoom)
      mutate(selectedRoom.id, {
        onSuccess: () => {
          toast.success("Room deleted successfully")
          closeModal()
          setSelectedRoom(null)
        }
      })
  }

  return (
    <DeleteModal
      show={modal === "DELETE"}
      onClose={closeModal}
      onConfirm={handleDelete}
      isDeleting={isDeleting}
      title="Delete Room"
      description="This action cannot be undone."
    >
      <p>You are about to delete room <span className="text-white font-medium">{selectedRoom?.roomNumber}</span></p>

    </DeleteModal>
  )
}