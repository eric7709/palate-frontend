import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCategoryStore } from "./store";
import { useCreateCategory, useUpdateCategory } from "./hooks";

interface CategoryFormValues {
    name: string;
    description: string;
}

const useCategoryForm = () => {
    const { selectedCategory, closeModal, modal, setModal } = useCategoryStore();

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (selectedCategory) {
            reset({
                name: selectedCategory.name,
                description: selectedCategory.description,
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        }
    }, [selectedCategory, reset]);

    const isEditing = !!selectedCategory;

    const submit = handleSubmit((data) => {
        if (isEditing) {
            updateCategory.mutate(
                {
                    id: selectedCategory.id,
                    dto: data,
                },
                {
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: (error) => {
                        console.error("Failed to update category:", error);
                    },
                }
            );
        } else {
            createCategory.mutate(data, {
                onSuccess: () => {
                    closeModal();
                },
                onError: (error) => {
                    console.error("Failed to create category:", error);
                },
            });
        }
    });

    useEffect(() => {
        if (modal == null) {
            reset({
                name: "",
                description: "",
            });
        }
    }, [modal, setModal])


    return {
        register,
        errors,
        isSubmitting: createCategory.isPending || updateCategory.isPending,
        isEditing,
        submit,
        closeModal,
        isOpened: modal == "createCategory" || modal == "editCategory",
        modal,
    };
};

export default useCategoryForm;