import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { AxiosRequestConfig } from "axios";

export const useGet = <T>(
    queryKey: unknown[], // Changed to unknown[] to allow passing objects like params
    url: string,
    enabled: boolean = true,
    options?: AxiosRequestConfig // Added optional 4th parameter for axios configuration options
) => {
    return useQuery<T>({
        queryKey,
        queryFn: async () => {
            // Spreads the configurations (like params) cleanly into the axios call
            const { data } = await api.get<T>(url, options);
            return data;
        },
        enabled,
    });
};