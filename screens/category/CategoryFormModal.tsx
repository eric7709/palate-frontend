"use client"
import useCategoryForm from '@/models/category/hook.form'
import { InputField } from '@/ui/InputField'
import Modal from '@/ui/Modal'

export default function CategoryFormModal() {
  const { errors, isEditing, isSubmitting, submit, register, closeModal, isOpened } = useCategoryForm()

  return (
    <Modal
      show={isOpened}
      onClose={closeModal}
      title={isEditing ? "Edit Category" : "Create Category"}
      description={isEditing ? "Update the category details" : "Add a new category to the menu"}
      isSubmitting={isSubmitting}
      onSave={submit}
    >
      <div className="space-y-5">
        <InputField
          label="Name"
          placeholder="e.g. Beverages"
          registration={register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
        <InputField
          label="Description"
          placeholder="e.g. Hot and cold drinks"
          registration={register("description", { required: "Description is required" })}
          error={errors.description?.message}
        />
      </div>
    </Modal>
  )
}