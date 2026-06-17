"use client"
import { Controller } from 'react-hook-form';
import { InputField, SelectField } from '@/src/shared/components/InputField';
import { useTableForm } from '@/src/tables/hooks/hook.form';
import Modal from '@/src/shared/components/Modal';

export default function TableFormModal() {
  const {
    errors,
    isEditing,
    isSubmitting,
    submit,
    register,
    control,
    closeModal,
    isOpened,
  } = useTableForm();

  return (
    <Modal
      show={isOpened}
      onClose={closeModal}
      title={isEditing ? 'Edit Table' : 'Create Table'}
      description={isEditing ? 'Update the table details' : 'Add a new table to the restaurant'}
      isSubmitting={isSubmitting}
      onSave={submit}
    >
      <div className="flex flex-col gap-3">
        <InputField
          label="Table Name"
          placeholder="e.g. Window Table"
          registration={register('tableName', { required: 'Table name is required' })}
          error={errors.tableName?.message}
        />
        <InputField
          label="Table Number"
          type="number"
          placeholder="e.g. 1"
          registration={register('tableNumber', {
            required: 'Table number is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Table number must be greater than 0' },
          })}
          error={errors.tableNumber?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Capacity"
            type="number"
            placeholder="e.g. 4"
            registration={register('capacity', {
              valueAsNumber: true,
              min: { value: 1, message: 'Capacity must be greater than 0' },
            })}
            error={errors.capacity?.message}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Status"
                value={field.value || ''}
                onChange={field.onChange}
                options={[
                  { label: 'Available', value: 'AVAILABLE' },
                  { label: 'Occupied', value: 'OCCUPIED' },
                  { label: 'Reserved', value: 'RESERVED' },
                ]}
                placeholder="Select status"
                error={errors.status?.message}
              />
            )}
          />
        </div>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
      </div>
    </Modal>
  );
}