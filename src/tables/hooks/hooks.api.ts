import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/src/shared/utils/api";
import { useGet } from "@/src/shared/utils/hook";
import { RestaurantTableRequestDTO, RestaurantTableResponseDTO } from "../types";
import { QueryParams, SpringPage } from "@/src/shared/utils/types";
import { RoomResponseDTO } from "../../room/types";

const BASE_URL = "/tables";
const QUERY_KEY = "tables";

// ==========================================
// GET HOOKS (Queries)
// ==========================================

export const useGetAllTables = (params?: QueryParams) => {
    return useGet<SpringPage<RestaurantTableResponseDTO>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};


export const useGetAllTablesNoPagination = () => {
    const {data} = useGetAllTables()
    return data?.content || [];
}


export const useGetTableById = (id?: number) => {
    return useGet<RestaurantTableResponseDTO>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};

export const useGetRoomByQrCode = (token?: string) => {
    return useGet<RoomResponseDTO>(
        [QUERY_KEY, 'qrcode', String(token)],
        `${BASE_URL}/by-qrcode?token=${encodeURIComponent(token || '')}`,
        !!token && token.trim().length > 0
    );
};

export const useGetTableByQrCode = (token?: string) => {
    return useGet<RestaurantTableResponseDTO>(
        [QUERY_KEY, 'qrcode', String(token)],
        `${BASE_URL}/by-qrcode?token=${encodeURIComponent(token || '')}`,
        !!token && token.trim().length > 0
    );
};

export const useGetTablesByAccount = (params: { waiterId?: number; cashierId?: number }) => {
    return useGet<RestaurantTableResponseDTO[]>(
        [QUERY_KEY, "by-account", params],
        `${BASE_URL}/by-account`,
        !!(params.waiterId || params.cashierId),
        { params }
    );
};

// ==========================================
// MUTATION HOOKS (Post / Put / Delete)
// ==========================================

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: RestaurantTableRequestDTO) => {
            const { data } = await api.post<RestaurantTableResponseDTO>(BASE_URL, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useCreateTablesBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dtos: RestaurantTableRequestDTO[]) => {
            const { data } = await api.post<RestaurantTableResponseDTO[]>(`${BASE_URL}/bulk`, dtos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useUpdateTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: RestaurantTableRequestDTO }) => {
            const { data } = await api.put<RestaurantTableResponseDTO>(`${BASE_URL}/${id}`, payload);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

export const useDeleteTable = () => {
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