import { useGet } from "@/utils/hook";
import { DashboardStats, DashboardParams, DashboardTopStats, DashboardTopParams, DashboardChartStats, DashboardChartParams } from "./types";

const BASE_URL = "/dashboard";
const QUERY_KEY = "dashboard";

export const useGetDashboardStats = (params?: DashboardParams) => {
    return useGet<DashboardStats>(
        [QUERY_KEY, "stats", params],
        `${BASE_URL}/stats`,
        !!params?.from && !!params?.to,
        { params }
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