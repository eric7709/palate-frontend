import axios from 'axios';
import { useAuthStore } from '@/models/auth/store';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define public endpoints that should never include the Authorization header
const publicPaths = [
  '/auth/login',
  '/auth/refresh',
  '/auth/register',
  '/customers',      // POST /api/palate/customers
  '/orders'          // POST /api/palate/orders (and GET? but POST is the public one)
];

// Helper to check if a request URL is public
const isPublicRequest = (url?: string): boolean => {
  if (!url) return false;
  return publicPaths.some(path => url.includes(path));
};

// Request interceptor: add token only for non-public requests
api.interceptors.request.use((config) => {
  if (!isPublicRequest(config.url)) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Token refresh queue (same as before, but only for non-public requests)
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

// Response interceptor: handle 401 only for non-public requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a public endpoint, don't attempt token refresh
    if (isPublicRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    // If not public and status is 401, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refreshing
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

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${apiUrl}/auth/refresh`, { refreshToken });
        const newAccessToken = data.accessToken;

        const { user, refreshToken: existingRefresh } = useAuthStore.getState();
        useAuthStore.getState().setAuth(user!, newAccessToken, existingRefresh!);
        useAuthStore.getState().setAccessToken(newAccessToken);

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