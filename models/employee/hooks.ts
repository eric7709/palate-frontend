import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { AccountRequestDTO, AccountResponseDTO } from "./types";
import { SpringPage } from "@/utils/types";
import { useGet } from "@/utils/hook";
import { SelectOption } from "@/ui/InputField";

const BASE_URL = "/employees";
const QUERY_KEY = "employees";

// ==========================================
// QUERIES
// ==========================================

export const useGetAllEmployees = (params?: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    return useGet<SpringPage<AccountResponseDTO>>(
        [QUERY_KEY, params], // 👈 key changes per page/search
        BASE_URL,
        true,
        {
            params, // 👈 axios query params go here
        }
    );
};

// ==========================================
// MUTATIONS
// ==========================================

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: AccountRequestDTO) => {
            const { data } = await api.post<AccountResponseDTO>(BASE_URL, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};


export const useGetWaiterOptions = (): SelectOption[] => {
    const { data } = useGetAllEmployees()
    return data?.content
        .filter(el => el.role === "ROLE_WAITER")
        .map(el => ({
            value: String(el.id),
            label: `${el.firstName} ${el.lastName}`
        })) ?? []
}


export const useGetCashierOptions = (): SelectOption[] => {
    const { data } = useGetAllEmployees()
    return data?.content
        .filter(el => el.role === "ROLE_CASHIER")
        .map(el => ({
            value: String(el.id),
            label: `${el.firstName} ${el.lastName}`
        })) ?? []
}


export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: AccountRequestDTO }) => {
            const { data } = await api.put<AccountResponseDTO>(`${BASE_URL}/${id}`, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`${BASE_URL}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};