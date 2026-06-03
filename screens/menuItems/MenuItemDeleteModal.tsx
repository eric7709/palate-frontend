import { useDeleteMenuItem } from '@/models/menuItem/hooks'
import { useMenuItemStore } from '@/models/menuItem/store'
import DeleteModal from '@/ui/DeleteModal'
import React from 'react'
import { toast } from 'sonner'

export default function MenuItemDeleteModal() {
    const { modal, selectedMenuItem, setSelectedMenuItem, setModal } = useMenuItemStore()
    const { mutate, isPending: isDeleting } = useDeleteMenuItem()
    const handleDelete = () => {
        if (selectedMenuItem)
            mutate(selectedMenuItem?.id, {
        onSuccess: () => {
            toast.success(selectedMenuItem.name + " deleted successfully")
            setModal(null)
            setSelectedMenuItem(null)
        }})
    }
    const closeModal = () => {
        setModal(null)
    }


    return (
        <DeleteModal
            show={modal === "deleteMenuItem"}
            onClose={closeModal}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Menu Item"
            description="This action cannot be undone."
        >
            <p>You are about to delete <span className="text-white font-medium">{selectedMenuItem?.name}</span></p>
        </DeleteModal>
    )
}
