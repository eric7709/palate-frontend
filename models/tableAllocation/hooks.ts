import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { TableAllocationResponseDTO, AllocationParams } from "./types";
import { SpringPage } from "@/utils/types"; 

const BASE_URL = "/table-allocations";
const QUERY_KEY = "table-allocations";

// ==========================================
// QUERIES
// ==========================================

export const useGetAllAllocations = (params: AllocationParams) => {
    return useQuery({
        queryKey: [QUERY_KEY, params],
        queryFn: async () => {
            const { data } = await api.get<SpringPage<TableAllocationResponseDTO>>(BASE_URL, { params });
            return data;
        }
    });
};

export const useGetAllocationById = (id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: async () => {
            const { data } = await api.get<TableAllocationResponseDTO>(`${BASE_URL}/${id}`);
            return data;
        },
        enabled: !!id
    });
};

// ==========================================
// MUTATIONS
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