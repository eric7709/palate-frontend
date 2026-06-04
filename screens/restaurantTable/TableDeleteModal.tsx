"use client"
import { useDeleteTable } from '@/models/restaurantTable/hooks'
import { useTableStore } from '@/models/restaurantTable/store'
import DeleteModal from '@/ui/DeleteModal'
import { toast } from 'sonner'

export default function TableDeleteModal() {
    const { modal, selectedTable, setSelectedTable, setModal } = useTableStore()
    const { mutate, isPending: isDeleting } = useDeleteTable()

    const handleDelete = () => {
        if (selectedTable)
            mutate(selectedTable.id, {
                onSuccess: () => {
                    toast.success(selectedTable.tableName + " deleted successfully")
                    setModal(null)
                    setSelectedTable(null)
                }
            })
    }

    const closeModal = () => setModal(null)

    return (
        <DeleteModal
            show={modal === "deleteTable"}
            onClose={closeModal}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Table"
            description="This action cannot be undone."
        >
            <p>You are about to delete <span className="text-white font-medium">{selectedTable?.tableName}</span></p>
        </DeleteModal>
    )
}