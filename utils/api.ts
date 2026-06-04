import axios from 'axios';
import { useAuthStore } from '@/models/auth/store';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints — no Auth header, no refresh attempts
const publicPaths = [
  '/auth/login',
  '/auth/refresh',
  '/auth/register',
];

const isPublicRequest = (url?: string, method?: string): boolean => {
  if (!url) return false;
  // POST /orders is public (customer placing an order)
  if (url.includes('/orders') && method?.toUpperCase() === 'POST') return true;
  // POST /customers is public (customer registration)
  if (url.includes('/customers') && method?.toUpperCase() === 'POST') return true;
  return publicPaths.some((path) => url.includes(path));
};

// Request interceptor: attach token only for protected requests
api.interceptors.request.use((config) => {
  if (!isPublicRequest(config.url, config.method)) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

// Response interceptor: only attempt refresh for protected, failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never attempt refresh for public endpoints
    if (isPublicRequest(originalRequest.url, originalRequest.method)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      // No refresh token means user is not logged in — don't redirect customers
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${apiUrl}/auth/refresh`, { refreshToken });
        const newAccessToken = data.accessToken;

        const { user, refreshToken: existingRefresh } = useAuthStore.getState();
        useAuthStore.getState().setAuth(user!, newAccessToken, existingRefresh!);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);