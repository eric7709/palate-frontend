import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/src/shared/utils/api";
import { 
    AccountRequestDTO, AuthResponseDTO, LoginRequestDTO, 
    MeDTO, ChangePasswordRequestDTO, MessageResponse, 
    RefreshTokenRequest, AccessTokenResponse 
} from "../types";

const BASE_URL = "/auth";

// ==========================================
// QUERIES
// ==========================================

export const useGetMe = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const { data } = await api.get<MeDTO>(`${BASE_URL}/me`);
            return data;
        },
        enabled
    });
};

// ==========================================
// MUTATIONS
// ==========================================

export const useSignup = () => {
    return useMutation({
        mutationFn: async (dto: AccountRequestDTO) => {
            const { data } = await api.post<AuthResponseDTO>(`${BASE_URL}/signup`, dto);
            return data;
        }
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: async (dto: LoginRequestDTO) => {
            const { data } = await api.post<AuthResponseDTO>(`${BASE_URL}/login`, dto);
            return data;
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (dto: ChangePasswordRequestDTO) => {
            const { data } = await api.put<MessageResponse>(`${BASE_URL}/change-password`, dto);
            return data;
        }
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async (dto: RefreshTokenRequest) => {
            const { data } = await api.post<AccessTokenResponse>(`${BASE_URL}/refresh`, dto);
            return data;
        }
    });
};