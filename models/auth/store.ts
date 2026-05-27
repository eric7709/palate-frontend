import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore } from "./types";

const defaultValues = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...defaultValues,
            setAuth: (user, accessToken, refreshToken) =>
                set({ user, accessToken, refreshToken, isAuthenticated: true }),
            setAccessToken: (accessToken) => set({ accessToken }),
            logout: () => set(defaultValues),
        }),
        {
            name: "auth-storage",
        }
    )
);