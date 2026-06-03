// hook.form.ts
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useCustomerStore } from "@/models/customer/store"
import { useCreateCustomer, useUpdateCustomer } from "@/models/customer/hooks"

export interface CustomerFormValues {
    name: string
    phoneNumber: string
    title: string
    email: string
}

const defaultValues: CustomerFormValues = {
    name: "",
    phoneNumber: "",
    title: "",
    email: "",
}

const useCustomerForm = () => {
    const { selectedCustomer, modal, closeModal } = useCustomerStore()
    const { mutateAsync: create, isPending: isCreating } = useCreateCustomer()
    const { mutateAsync: update, isPending: isUpdating } = useUpdateCustomer()

    const isEditing = modal === "editCustomer"

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
        control
    } = useForm<CustomerFormValues>({ defaultValues })

    useEffect(() => {
        if (selectedCustomer) {
            reset({
                name: selectedCustomer.name,
                phoneNumber: selectedCustomer.phoneNumber || "",
                title: selectedCustomer.title || "",
                email: selectedCustomer.email || "",
            })
        } else {
            reset(defaultValues)
        }
    }, [selectedCustomer, reset])

    useEffect(() => {
        if (modal == null) reset(defaultValues)
    }, [modal])

    const submit = handleSubmit(async (data) => {
        try {
            if (isEditing && selectedCustomer) {
                await update({ id: selectedCustomer.id, dto: data })
            } else {
                await create(data)
            }
            closeModal()
        } catch (error: any) {
            setError("root", {
                message: error?.response?.data?.message || "Something went wrong",
            })
        }
    })

    return {
        register,
        errors,
        isSubmitting: isCreating || isUpdating,
        isEditing,
        submit,
        closeModal,
        control,
        isOpened: modal === "createCustomer" || modal === "editCustomer",
    }
}

export default useCustomerForm