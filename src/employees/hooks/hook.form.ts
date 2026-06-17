import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateEmployee, useGetAllEmployees, useUpdateEmployee } from "@/src/employees/hooks/hooks.api";
import { useEmployeeStore } from "../store";
import { AccountRequestDTO } from "@/src/auth";



const defaultValues: AccountRequestDTO = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: null,
    password: "",
    status: "active",
    role: null,
};

export const useEmployeeForm = () => {
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
    } = useForm<AccountRequestDTO>({ defaultValues });

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
