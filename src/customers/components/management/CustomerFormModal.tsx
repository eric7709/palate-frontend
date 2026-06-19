"use client";

import { Controller } from 'react-hook-form';
import { InputField, SelectField } from '@/src/shared/components/input/InputField';
import useCustomerForm from '@/src/customers/hooks/hook.form';
import CompactModal from '@/src/shared/components/modals/Modal';

const titleOptions = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
  { label: "Miss", value: "Miss" },
  { label: "Dr", value: "Dr" },
];

export default function CustomerFormModal() {
  const { errors, isEditing, isSubmitting, submit, register, control, closeModal, isOpened } = useCustomerForm();

  return (
    <CompactModal
      show={isOpened}
      onClose={closeModal}
      title={isEditing ? "Edit Customer" : "Create Customer"}
      description={isEditing ? "Update customer details" : "Add a new customer"}
      isSubmitting={isSubmitting}
      onSave={submit}
    >
      <div className="space-y-3">
        <InputField
          label="Full Name"
          placeholder="e.g. John Doe"
          registration={register("name", { required: "Name is required" })}
          error={errors.name?.message}
          required
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Title"
              value={field.value}
              onChange={field.onChange}
              options={titleOptions}
              placeholder="Select title"
              error={errors.title?.message}
            />
          )}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="e.g. john@example.com"
          registration={register("email")}
          error={errors.email?.message}
        />
        <InputField
          label="Phone Number"
          placeholder="e.g. 08012345678"
          registration={register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
      </div>
    </CompactModal>
  );
}