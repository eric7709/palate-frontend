import { useGet } from "@/utils/hook";
import { DashboardTopStats, DashboardTopParams, DashboardChartStats, DashboardChartParams, DashboardDTO } from "./types";

const BASE_URL = "/dashboard";
const QUERY_KEY = "dashboard";

// hooks/useDashboard.ts

export const useGetDashboardStats = () => {
    return useGet<DashboardDTO>(
        [QUERY_KEY, "stats"],
        `${BASE_URL}/stats`,
        true, // Always enabled since no params are required
        {}    // Empty config object
    );
};

export const useGetDashboardTopStats = (params?: DashboardTopParams) => {
    return useGet<DashboardTopStats>(
        [QUERY_KEY, "top", params],
        `${BASE_URL}/top`,
        !!params?.from && !!params?.to,
        { params }
    );
};

export const useGetDashboardChartStats = (params?: DashboardChartParams) => {
    return useGet<DashboardChartStats>(
        [QUERY_KEY, "charts", params],
        `${BASE_URL}/charts`,
        !!params?.from && !!params?.to,
        { params }
    );
};