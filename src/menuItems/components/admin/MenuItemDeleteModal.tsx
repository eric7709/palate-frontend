"use client"
import { useDeleteMenuItem } from '@/src/menuItems/hooks/hooks.api'
import { useMenuItemStore } from '@/src/menuItems/store'
import DeleteModal from '@/src/shared/components/DeleteModal'
import { toast } from 'sonner'

export function MenuItemDeleteModal() {
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
            <p>You are about to delete <span className="font-semibold">{selectedMenuItem?.name}</span></p>
        </DeleteModal>
    )
}
