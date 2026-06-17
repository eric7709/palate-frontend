import { RoomResponseDTO } from "@/src/room/types";
import { api } from "@/src/shared/utils/api";
import { useGet } from "@/src/shared/utils/hook";
import { useOrderRequestStore } from "@/src/ordering/store.request";
import { useOrderCustomerStore } from "@/src/customers/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    OrderResponseDTO,
    OrderPageResponse, // Updated Import
    UpdateOrderStatusDTO,
    CustomerOrderDTO,
    OrderSummaryResponse,
    OrderFilterParams,
    OrderHourDTO,
    TableAvgDTO,
    OrderRequestDTO,
} from "../types";
import { useEffect, useMemo } from "react";
import { useOrderStore } from "../store";
import { useAuthStore } from "@/src/auth/store";
import { RestaurantTableResponseDTO } from "@/src/tables/types";

const BASE_URL = "/orders";
const QUERY_KEY = "orders";

// ==========================================
// GET HOOKS (Queries)
// ==========================================

/**
 * Updated to return OrderPageResponse as defined in your Controller and DTO
 */
export const useGetAllOrders = (params?: OrderFilterParams) => {
    return useGet<OrderPageResponse>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};

export const useGetOrderById = (id?: number) => {
    return useGet<OrderResponseDTO>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};

export const useGetCustomerOrdersToday = (customerId?: number) => {
    return useGet<CustomerOrderDTO[]>(
        [QUERY_KEY, "customer", String(customerId)],
        `${BASE_URL}/customer/${customerId}`,
        !!customerId
    );
};

export const useGetActiveOrdersCount = () => {
    const { data, ...rest } = useGet<number>(
        [QUERY_KEY, "active", "count"],
        `${BASE_URL}/active/count`,
        true,
        {}
    );
    return { data: data ?? 0, ...rest };
};

export const useGetHourlyOrders = () => {
    return useGet<OrderHourDTO[]>(
        ["orders-hourly"],
        `${BASE_URL}/hourly`,
        true
    );
};

export const useGetTableAnalytics = () => {
    return useGet<TableAvgDTO[]>(
        ["orders-table-avg"],
        `${BASE_URL}/table-avg`,
        true
    );
};

export const useGetOrderSummary = () => {
    const startDate = useOrderStore(state => state.startDate)
    const endDate = useOrderStore(state => state.endDate)
    const auth = useAuthStore(state => state)
    const role = auth.user?.role
    const cashierId = auth ? role == "ROLE_CASHIER" ? auth.user?.id : null : null
    const waiterId = auth ? role == "ROLE_WAITER" ? auth.user?.id : null : null
    const resolvedParams = useMemo(() => ({
        startDate,
        endDate,
        waiterId: waiterId || null,
        cashierId: cashierId || null,
    }), [startDate, endDate, waiterId, cashierId]);

    return useGet<OrderSummaryResponse>(
        [QUERY_KEY, "summary", resolvedParams],
        `${BASE_URL}/summary`,
        true,
        { params: resolvedParams }
    );
};

// ==========================================
// MUTATION HOOKS (Post / Patch)
// ==========================================

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: OrderRequestDTO) => {
            const { data } = await api.post<OrderResponseDTO>(BASE_URL, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, "customer"] }); // prefix match
        }
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: UpdateOrderStatusDTO }) => {
            const { data } = await api.patch<OrderResponseDTO>(`${BASE_URL}/${id}`, dto);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};


export function useCustomerOrders() {
    const {customer} = useOrderCustomerStore()
    const { data: orders = [], isLoading, error } = useGetCustomerOrdersToday(customer?.id ?? undefined);
    return { orders, isLoading, error };
}



export function useSyncTableOrderContext(tableData?: RestaurantTableResponseDTO) {
    const { setCashierId, setTableId, setWaiterId, setOrderStatus } = useOrderRequestStore();
    useEffect(() => {
        if (!tableData) return;
        setCashierId(tableData.cashierId);
        setTableId(tableData.id);
        setWaiterId(tableData.waiterId);
        setOrderStatus("PENDING");
    }, [tableData, setCashierId, setTableId, setWaiterId, setOrderStatus]);
}

export function useSyncRoomOrderContext(roomData: RoomResponseDTO) {
    const { setCashierId, setRoomId, setOrderStatus } = useOrderRequestStore();
    useEffect(() => {
        if (!roomData) return;
        setCashierId(Number(roomData.cashierId));
        setRoomId(roomData.id);
        setOrderStatus("PENDING");
    }, [roomData, setCashierId, setRoomId, setOrderStatus]);
}