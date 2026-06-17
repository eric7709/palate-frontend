import { api } from "@/src/shared/utils/api";
import { useGet } from "@/src/shared/utils/hook";
import { QueryParams, SpringPage } from "@/src/shared/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerRequestDTO, Customer } from "../types";

const BASE_URL = "/customers";
const QUERY_KEY = "customers";

export const useGetAllCustomers = (params?: QueryParams) => {
    return useGet<SpringPage<Customer>>(
        [QUERY_KEY, params],
        BASE_URL,
        true,
        { params }
    );
};

export const useGetCustomerById = (id?: number) => {
    return useGet<Customer>(
        [QUERY_KEY, String(id)],
        `${BASE_URL}/${id}`,
        !!id
    );
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: CustomerRequestDTO) => {
            const { data } = await api.post<Customer>(BASE_URL, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: number; dto: CustomerRequestDTO }) => {
            const { data } = await api.put<Customer>(`${BASE_URL}/${id}`, dto);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, String(variables.id)] });
        }
    });
};

export const useDeleteCustomer = () => {
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