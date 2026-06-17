"use client"
import { Controller } from 'react-hook-form';
import { InputField, SelectField, TextareaField } from '@/src/shared/components/InputField';
import { useMenuItemForm } from '@/src/menuItems/hooks/hook.form';
import Modal from '@/src/shared/components/Modal';
import ImageUpload from '@/src/shared/components/ImageUpload';

export function MenuItemFormModal() {
  const {
    errors,
    isEditing,
    isSubmitting,
    submit,
    register,
    control,
    closeModal,
    categoryOptions,
    isOpened,
  } = useMenuItemForm();

  return (
    <Modal
      show={isOpened}
      onClose={closeModal}
      title={isEditing ? 'Edit Menu Item' : 'Create Menu Item'}
      description={
        isEditing
          ? 'Update the menu item details'
          : 'Add a new item to your menu'
      }
      isSubmitting={isSubmitting}
      onSave={submit}
    >
      <div className="flex flex-col gap-3">
        <InputField
          label="Name"
          placeholder="e.g. Fried Rice"
          registration={register('name', {
            required: 'Name is required',
          })}
          error={errors.name?.message}
        />
        <Controller
          name="categoryId"
          control={control}
          rules={{
            required: 'Category is required',
          }}
          render={({ field }) => (
            <SelectField
              label="Category"
              value={String(field.value || '')}
              onChange={(value) => field.onChange(Number(value))}
              options={categoryOptions}
              placeholder="Select category"
              error={errors.categoryId?.message}
            />
          )}
        />
        <TextareaField
          label="Description"
          placeholder="e.g. Delicious fried rice with chicken"
          registration={register('description')}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-2 gap-3">

        </div>

        <InputField
          label="Price"
          type="number"
          placeholder="e.g. 2500"
          registration={register('price', {
            required: 'Price is required',
            valueAsNumber: true,
            min: {
              value: 1,
              message: 'Price must be greater than 0',
            },
          })}
          error={errors.price?.message}
        />
        <ImageUpload />
        {errors.root && (
          <p className="text-sm text-red-500">
            {errors.root.message}
          </p>
        )}
      </div>
    </Modal>
  );
}