"use client"

import { useDeleteCustomer } from '@/models/customer/hooks'
import { useCustomerStore } from '@/models/customer/store'
import DeleteModal from '@/ui/DeleteModal'
import { toast } from 'sonner'

export default function CustomerDeleteModal() {
    const { modal, selectedCustomer, setSelectedCustomer, setModal } = useCustomerStore()
    const { mutate, isPending: isDeleting } = useDeleteCustomer()

    const handleDelete = () => {
        if (selectedCustomer)
            mutate(selectedCustomer.id, {
                onSuccess: () => {
                    toast.success(selectedCustomer.name + " deleted successfully")
                    setModal(null)
                    setSelectedCustomer(null)
                }
            })
    }

    return (
        <DeleteModal
            show={modal === "deleteCustomer"}
            onClose={() => setModal(null)}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Customer"
            description="This action cannot be undone."
        >
            <p>You are about to delete <span className="text-white font-medium">{selectedCustomer?.name}</span></p>
        </DeleteModal>
    )
}