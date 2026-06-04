import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { TableAllocationResponseDTO, TableAllocationFilters } from "./types";
import { SpringPage } from "@/utils/types";
import { useGet } from "@/utils/hook";

const BASE_URL = "/table-allocations";
const QUERY_KEY = "table-allocations";

// ==========================================
// QUERIES (using useGet pattern)
// ==========================================

export const useGetAllAllocations = (params: TableAllocationFilters) => {
    return useGet<SpringPage<TableAllocationResponseDTO>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,                    // enabled
        { params }               // AxiosRequestConfig (includes query params)
    );
};

export const useGetAllocationById = (id: number) => {
    return useGet<TableAllocationResponseDTO>(
        [QUERY_KEY, id],
        `${BASE_URL}/${id}`,
        !!id,                    // enabled only when id is truthy
        {}                       // optional config (can be omitted if no extra options)
    );
};

// ==========================================
// MUTATIONS (unchanged)
// ==========================================

export const useAllocateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tableId, staffId }: { tableId: number; staffId: number }) => {
            const { data } = await api.post<TableAllocationResponseDTO>(
                `${BASE_URL}/allocate?tableId=${tableId}&staffId=${staffId}`
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useDeallocateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ tableId, staffId }: { tableId: number; staffId: number }) => {
            await api.post(`${BASE_URL}/deallocate?tableId=${tableId}&staffId=${staffId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};