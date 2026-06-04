"use client"

import { useDeleteEmployee } from '@/models/employee/hooks'
import { useEmployeeStore } from '@/models/employee/store'
import DeleteModal from '@/ui/DeleteModal'
import { toast } from 'sonner'

export default function EmployeeDeleteModal() {
    const { modal, selectedEmployeeId, setSelectedEmployeeId, setModal } = useEmployeeStore()
    const { mutate, isPending: isDeleting } = useDeleteEmployee()

    const handleDelete = () => {
        if (selectedEmployeeId)
            mutate(selectedEmployeeId, {
                onSuccess: () => {
                    toast.success("Employee deleted successfully")
                    setModal(null)
                    setSelectedEmployeeId(null)
                }
            })
    }

    return (
        <DeleteModal
            show={modal === "deleteEmployee"}
            onClose={() => setModal(null)}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Employee"
            description="This action cannot be undone."
        />
    )
}