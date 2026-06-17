import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/src/shared/utils/api";
import { useGet } from "@/src/shared/utils/hook";
import { QueryParams, SpringPage } from "@/src/shared/utils/types";
import { RoomResponseDTO } from "../types"; // Adjust path as needed

// Plugs directly into your Spring Boot RoomController endpoint base path
const BASE_URL = "/rooms"; 
const QUERY_KEY = "rooms";

// ==========================================
// GET HOOKS (Queries)
// ==========================================

/**
 * Fetch all rooms with backend specification filter parameters (search, active, paging)
 */
export const useGetAllRooms = (params?: QueryParams) => {
    return useGet<SpringPage<RoomResponseDTO>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};

/**
 * Accessor helper to extract flat lists instantly when pagination arrays aren't necessary
 */
export const useGetAllRoomsNoPagination = () => {
    const { data } = useGetAllRooms();
    return data?.content || [];
};

/**
 * Fetch a single detailed Room by its primary database identifier key
 */
export const useGetRoomById = (id?: number) => {
    return useGet<RoomResponseDTO>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};

/**
 * Fetch detailed Room context dynamically via a scanned QR token string parameter
 */
export const useGetRoomByQrCode = (token?: string) => {
    return useGet<RoomResponseDTO>(
        [QUERY_KEY, "qrcode", String(token)],
        `${BASE_URL}/by-qrcode?token=${encodeURIComponent(token || "")}`,
        !!token && token.trim().length > 0
    );
};

// ==========================================
// MUTATION HOOKS (Post / Put / Delete)
// ==========================================

/**
 * Create a brand new single Room entry instance
 */
export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => { // Replaces your RoomRequestDTO structure context
            const { data } = await api.post<RoomResponseDTO>(BASE_URL, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

/**
 * Create multiple rooms concurrently using a bulk transaction request payload array
 */
export const useCreateRoomsBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dtos: any[]) => {
            const { data } = await api.post<RoomResponseDTO[]>(`${BASE_URL}/bulk`, dtos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

/**
 * Update an existing room instance details by ID matching your backend structural expectations
 */
export const useUpdateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
            const { data } = await api.put<RoomResponseDTO>(`${BASE_URL}/${id}`, payload);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

/**
 * Remove a Room instance completely from the database tracking logs
 */
export const useDeleteRoom = () => {
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

/**
 * Allocate a cashier to a room
 */
export const useAllocateCashier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, cashierId }: { id: number; cashierId: number }) => {
            const { data } = await api.post<RoomResponseDTO>(`${BASE_URL}/${id}/cashier/${cashierId}`);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

/**
 * Deallocate the cashier currently assigned to a room
 */
export const useDeallocateCashier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.delete<RoomResponseDTO>(`${BASE_URL}/${id}/cashier`);
            return data;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(id)] });
        }
    });
};