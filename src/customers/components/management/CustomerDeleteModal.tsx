"use client"

import { useDeleteCustomer } from '@/src/customers/hooks/hooks.api'
import { useCustomerStore } from '@/src/customers/store'
import DeleteModal from '@/src/shared/components/modals/DeleteModal'
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
            <p>You are about to delete <span className=" font-semibold">{selectedCustomer?.name}</span></p>
        </DeleteModal>
    )
}