"use client"
import DeleteModal from '@/src/shared/components/DeleteModal'
import { toast } from 'sonner'
import { useCategoryStore } from '@/src/categories/store'
import { useDeleteCategory } from '@/src/categories/hooks/hooks.api'

export function CategoryDeleteModal() {
    const { modal, selectedCategory, setSelectedCategory, setModal } = useCategoryStore()
    const { mutate, isPending: isDeleting } = useDeleteCategory()
    const handleDelete = () => {
        if (selectedCategory)
            mutate(selectedCategory?.id, {
        onSuccess: () => {
            toast.success(selectedCategory.name + " deleted successfully")
            setModal(null)
            setSelectedCategory(null)
        }})
    }
    const closeModal = () => {
        setModal(null)
    }


    return (
        <DeleteModal
            show={modal === "deleteCategory"}
            onClose={closeModal}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            title="Delete Category"
            description="This action cannot be undone."
        >
            <p>You are about to delete <span className="text-white font-medium">{selectedCategory?.name}</span></p>
        </DeleteModal>
    )
}
