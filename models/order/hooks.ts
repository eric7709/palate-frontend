import { api } from "@/utils/api";
import { useGet } from "@/utils/hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    OrderRequestDTO,
    OrderResponseDTO,
    OrderPageResponse, // Updated Import
    UpdateOrderStatusDTO,
    CustomerOrderDTO,
    OrderSummaryResponse,
    OrderFilterParams
} from "./types";
import { useAuthStore } from "../auth/store";
import { Role } from "../auth/types";
import { useMemo } from "react";
import { useOrderStore } from "./store";

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

export type RoleType =
    | "ROLE_ADMIN"
    | "ROLE_CHEF"
    | "ROLE_COOK"
    | "ROLE_BAKER"
    | "ROLE_WAITER"
    | "ROLE_CASHIER"
    | "ROLE_MANAGER";


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