// hook.form.ts
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateEmployee, useGetAllEmployees, useUpdateEmployee } from "@/models/employee/hooks";
import { useEmployeeStore } from "@/models/employee/store";
import { AccountRequestDTO } from "@/models/employee/types";

export interface EmployeeFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    password?: string;
    status: string;
    role: string;
}

const defaultValues: EmployeeFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    password: "",
    status: "active",
    role: "",
};

const useEmployeeForm = () => {
    const { selectedEmployee, modal, closeModal } = useEmployeeStore();
    const { data } = useGetAllEmployees();

    const { mutateAsync: create, isPending: isCreating } = useCreateEmployee();
    const { mutateAsync: update, isPending: isUpdating } = useUpdateEmployee();

    const isEditing = modal === "editEmployee";

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        const length = Math.floor(Math.random() * 5) + 8; // 8-12
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setError,
    } = useForm<EmployeeFormValues>({ defaultValues });

    useEffect(() => {
        if (selectedEmployee) {
            reset({
                firstName: selectedEmployee.firstName,
                lastName: selectedEmployee.lastName,
                email: selectedEmployee.email,
                phoneNumber: selectedEmployee.phoneNumber,
                gender: selectedEmployee.gender,
                status: selectedEmployee.status,
                role: selectedEmployee.role,
                password: generateRandomPassword()
            });
        } else {
            reset(defaultValues);
        }
    }, [selectedEmployee, reset]);

    useEffect(() => {
        if (modal == null) reset(defaultValues);
    }, [modal]);

    const submit = handleSubmit(async (data) => {
        try {
            const payload: AccountRequestDTO = {
                ...data,
                password: data.password || undefined,
            };

            if (isEditing && selectedEmployee) {
                await update({ id: selectedEmployee.id, dto: payload });
            } else {
                await create(payload);
            }
            closeModal();
        } catch (error: any) {
            console.log(error)
            setError("root", {
                message: error?.response?.data?.message || "Something went wrong",
            });
        }
    });

    return {
        register,
        errors,
        isSubmitting: isCreating || isUpdating,
        isEditing,
        submit,
        control,
        closeModal,
        isOpened: modal === "createEmployee" || modal === "editEmployee",
    };
};

export default useEmployeeForm;