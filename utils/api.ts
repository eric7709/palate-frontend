import axios from 'axios';
import { useAuthStore } from '@/models/auth/store';

const apiUrl =  
  (process.env.NEXT_PUBLIC_ENVIRONMENT === "DEV" || process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api/palate"
    : "https://palate-backend.onrender.com/api/palate");

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Explicit base string matches for unauthenticated open endpoints
const publicPaths = [
  '/auth/login',
  '/auth/refresh',
  '/auth/register',
];

const isPublicRequest = (url?: string, method?: string): boolean => {
  if (!url) return false;
  
  const upperMethod = method?.toUpperCase();

  // POST /orders (guest placing an order)
  if (url.includes('/orders') && upperMethod === 'POST') return true;
  
  // POST /customers (guest profile checkout initialization)
  if (url.includes('/customers') && upperMethod === 'POST') return true;

  // 2. Added public accessibility allowances for scanning standalone table/room QR links
  if (url.includes('/tables/by-qrcode') && upperMethod === 'GET') return true;
  if (url.includes('/rooms/by-qrcode') && upperMethod === 'GET') return true;

  return publicPaths.some((path) => url.includes(path));
};

// Request interceptor: attach token only for protected routes
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

// Response interceptor: handles JWT token token rotation automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never attempt token refresh hooks on anonymous routes
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

      // Unauthenticated state fallback edge check
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
        
        // Client window redirect safety fallback check
        if (typeof window !== "undefined") {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);