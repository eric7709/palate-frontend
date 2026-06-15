"use client"

import { useDeleteEmployee } from '@/models/employee/hooks'
import { useEmployeeStore } from '@/models/employee/store'
import DeleteModal from '@/ui/DeleteModal'
import { toast } from 'sonner'

export default function EmployeeDeleteModal() {
    const { modal, selectedEmployee, closeModal } = useEmployeeStore()
    const { mutate, isPending: isDeleting } = useDeleteEmployee()

    const handleDelete = () => {
        if (selectedEmployee)
            mutate(selectedEmployee.id, {
                onSuccess: () => {
                    toast.success("Employee deleted successfully")
                    closeModal()
                }
            })
    }

    return (
        <DeleteModal
            show={modal === "deleteEmployee"}
            onClose={closeModal}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Employee"
            description="This action cannot be undone."
        >
            <p>You are about to delete <span className="font-medium">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</span></p>
        </DeleteModal>
    )
}