"use client"

import { Controller } from 'react-hook-form';
import { InputField, SelectField } from '@/ui/InputField';
import useEmployeeForm from '@/models/employee/hook.form';
import Modal from '@/ui/Modal';

const roleOptions = [
    { label: "Chef", value: "ROLE_CHEF" },
    { label: "Cook", value: "ROLE_COOK" },
    { label: "Baker", value: "ROLE_BAKER" },
    { label: "Waiter", value: "ROLE_WAITER" },
    { label: "Cashier", value: "ROLE_CASHIER" },
    { label: "Manager", value: "ROLE_MANAGER" },
];

const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
];

const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
];

export default function EmployeeFormModal() {
    const { errors, isEditing, isSubmitting, submit, register, control, closeModal, isOpened } = useEmployeeForm();

    return (
        <Modal
            show={isOpened}
            onClose={closeModal}
            title={isEditing ? "Edit Employee" : "Create Employee"}
            description={isEditing ? "Update employee details" : "Add a new employee"}
            isSubmitting={isSubmitting}
            onSave={submit}
        >
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <InputField
                        label="First Name"
                        placeholder="e.g. John"
                        registration={register("firstName", { required: "First name is required" })}
                        error={errors.firstName?.message}
                    />
                    <InputField
                        label="Last Name"
                        placeholder="e.g. Doe"
                        registration={register("lastName", { required: "Last name is required" })}
                        error={errors.lastName?.message}
                    />
                </div>

                <InputField
                    label="Email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    registration={register("email", { required: "Email is required" })}
                    error={errors.email?.message}
                />

                <InputField
                    label="Phone Number"
                    placeholder="e.g. 08012345678"
                    registration={register("phoneNumber", { required: "Phone number is required" })}
                    error={errors.phoneNumber?.message}
                />

                <div className="grid grid-cols-2 gap-3">
                    <Controller
                        name="gender"
                        control={control}
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                            <SelectField
                                label="Gender"
                                value={field.value}
                                onChange={field.onChange}
                                options={genderOptions}
                                placeholder="Select gender"
                                error={errors.gender?.message}
                            />
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                            <SelectField
                                label="Status"
                                value={field.value}
                                onChange={field.onChange}
                                options={statusOptions}
                                placeholder="Select status"
                                error={errors.status?.message}
                            />
                        )}
                    />
                </div>

                <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                        <SelectField
                            label="Role"
                            value={field.value}
                            onChange={field.onChange}
                            options={roleOptions}
                            placeholder="Select role"
                            error={errors.role?.message}
                        />
                    )}
                />

                {errors.root && (
                    <p className="text-sm text-red-500">{errors.root.message}</p>
                )}
            </div>
        </Modal>
    );
}