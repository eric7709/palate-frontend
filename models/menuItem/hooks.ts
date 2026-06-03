import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useGet } from "@/utils/hook";
import { QueryParams, SpringPage } from "@/utils/types";
import { MenuItemRequestDTO, MenuItemResponseDTO } from "./types";

const BASE_URL = "/menu-items";
const QUERY_KEY = "menu-items";

// ==========================================
// GET HOOKS (Queries)
// ==========================================

export const useGetAllMenuItems = (params?: QueryParams) => {
    return useGet<SpringPage<MenuItemResponseDTO>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};

export const useGetMenuItemById = (id?: number) => {
    return useGet<MenuItemResponseDTO>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};

// ==========================================
// MUTATION HOOKS (Post / Put / Delete)
// ==========================================

export const useCreateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: MenuItemRequestDTO) => {
            const { data } = await api.post<MenuItemResponseDTO>(BASE_URL, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useCreateMenuItemsBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dtos: MenuItemRequestDTO[]) => {
            const { data } = await api.post<MenuItemResponseDTO[]>(`${BASE_URL}/bulk`, dtos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useUpdateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: MenuItemRequestDTO }) => {
            const { data } = await api.put<MenuItemResponseDTO>(`${BASE_URL}/${id}`, payload);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

export const useDeleteMenuItem = () => {
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

// ==========================================
// ADDITIONAL UTILITY MUTATIONS
// ==========================================

/**
 * Given a list of menu item IDs, returns the subset that are UNAVAILABLE.
 * Useful for validating an order before submission.
 */
export const useGetUnavailableMenuItems = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => {
            const { data } = await api.post<number[]>(`${BASE_URL}/unavailable`, ids);
            return data;
        }
        // No cache invalidation needed – this is a read‑only check
    });
};

/**
 * Given a list of menu item IDs, returns the subset that are AVAILABLE.
 * Complementary to useGetUnavailableMenuItems.
 */
export const useGetAvailableMenuItems = () => {
    return useMutation({
        mutationFn: async (ids: number[]) => {
            const { data } = await api.post<number[]>(`${BASE_URL}/available`, ids);
            return data;
        }
    });
};