"use client"

import { Controller } from 'react-hook-form';
import { InputField, SelectField } from '@/src/shared/components/input/InputField';
import Modal from '@/src/shared/components/modals/Modal';
import { useRoomForm } from '@/src/room/hooks/hook.form';

const statusOptions = [
    { label: "Available", value: "AVAILABLE" },
    { label: "Unavailable", value: "UNAVAILABLE" },
];

export default function RoomFormModal() {
    const { errors, isEditing, isSubmitting, submit, register, control, closeModal, isOpened } = useRoomForm();

    return (
        <Modal
            show={isOpened}
            onClose={closeModal}
            title={isEditing ? "Edit Room" : "Create Room"}
            description={isEditing ? "Update room details" : "Add a new room"}
            isSubmitting={isSubmitting}
            onSave={submit}
        >
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <InputField
                        label="Room Number"
                        placeholder="e.g. A1"
                        registration={register("roomNumber", { required: "Room number is required" })}
                        error={errors.roomNumber?.message}
                    />
                    <InputField
                        label="Floor"
                        type="number"
                        placeholder="e.g. 1"
                        registration={register("floor")}
                        error={errors.floor?.message}
                    />
                </div>

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

                {errors.root && (
                    <p className="text-sm text-red-500">{errors.root.message}</p>
                )}
            </div>
        </Modal>
    );
}