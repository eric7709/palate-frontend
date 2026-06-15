import { api } from "@/utils/api";
import { useGet } from "@/utils/hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "./types";

const BASE_URL = "/notifications";
const QUERY_KEY = "notifications";


export const useGetMyNotifications = () => {
    return useGet<Notification[]>(
        [QUERY_KEY],
        BASE_URL,
        true
    );
};

export const useGetUnreadCount = () => {
    return useGet<{ count: number }>(
        [QUERY_KEY, "unread-count"],
        `${BASE_URL}/unread-count`,
        true
    );
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.patch<Notification>(`${BASE_URL}/${id}/read`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.patch<void>(`${BASE_URL}/read-all`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        }
    });
};