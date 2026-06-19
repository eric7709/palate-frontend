// hooks.ts
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/src/shared/utils/api";
import { useGet } from "@/src/shared/utils/hook";
import { CategoryRequestDTO, CategoryResponseDTO } from "../types";
import { QueryParams, SpringPage } from "@/src/shared/utils/types";
import { useState } from "react";
import { SelectOption } from "@/src/shared/components/input/InputField";

const BASE_URL = "/categories";
const QUERY_KEY = "categories";

// ==========================================
// GET HOOKS (Queries)
// ==========================================

export const useGetAllCategories = (params?: QueryParams) => {
    return useGet<SpringPage<CategoryResponseDTO>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};

export const useGetCategoryById = (id?: number) => {
    return useGet<CategoryResponseDTO>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};



// ==========================================
// MUTATION HOOKS (Post / Put / Delete)
// ==========================================

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: CategoryRequestDTO) => {
            const { data } = await api.post<CategoryResponseDTO>(BASE_URL, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useCreateCategoriesBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dtos: CategoryRequestDTO[]) => {
            const { data } = await api.post<CategoryResponseDTO[]>(`${BASE_URL}/bulk`, dtos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: CategoryRequestDTO }) => {
            const { data } = await api.put<CategoryResponseDTO>(`${BASE_URL}/${id}`, dto);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

export const useGetCategoryOptions = (): SelectOption[] => {
    const { data } = useGetAllCategories();
    if (!data) return [];

    return data.content.map((category) => ({
        label: category.name,
        value: String(category.id),
    }));
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete<void>(`${BASE_URL}/${id}`);
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(id)] });
        }
    });
};
