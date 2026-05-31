
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { analyticsKeys } from "./keys";
import {
  AnalyticsParams,
  RevenueSummaryDTO,
  RevenueOverTimeDTO,
  OrdersByStatusDTO,
  PeakHourDTO,
  MenuItemPerformanceDTO,
  CancelledItemDTO,
  CustomerSummaryDTO,
  TopCustomerDTO,
  StaffPerformanceDTO,
  TableActivityDTO,
} from "./types";

const BASE_URL = "/analytics";

// ── Shared enabled guard ─────────────────────────────────────────────────────

const hasRange = (p: AnalyticsParams) => !!p.startDate && !!p.endDate;

// ── Revenue ──────────────────────────────────────────────────────────────────

export const useRevenueSummary = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.revenueSummary(params),
    queryFn: async () => {
      const { data } = await api.get<RevenueSummaryDTO>(
        `${BASE_URL}/revenue/summary`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const useRevenueOverTime = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.revenueOverTime(params),
    queryFn: async () => {
      const { data } = await api.get<RevenueOverTimeDTO[]>(
        `${BASE_URL}/revenue/over-time`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

// ── Orders ───────────────────────────────────────────────────────────────────

export const useOrdersByStatus = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.ordersByStatus(params),
    queryFn: async () => {
      const { data } = await api.get<OrdersByStatusDTO[]>(
        `${BASE_URL}/orders/by-status`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const usePeakHours = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.peakHours(params),
    queryFn: async () => {
      const { data } = await api.get<PeakHourDTO[]>(
        `${BASE_URL}/orders/peak-hours`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

// ── Menu ─────────────────────────────────────────────────────────────────────

export const useTopItems = (params: AnalyticsParams, limit = 10) =>
  useQuery({
    queryKey: analyticsKeys.topItems({ ...params, limit }),
    queryFn: async () => {
      const { data } = await api.get<MenuItemPerformanceDTO[]>(
        `${BASE_URL}/menu/top-items`,
        { params: { ...params, limit } }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const useLeastItems = (params: AnalyticsParams, limit = 10) =>
  useQuery({
    queryKey: analyticsKeys.leastItems({ ...params, limit }),
    queryFn: async () => {
      const { data } = await api.get<MenuItemPerformanceDTO[]>(
        `${BASE_URL}/menu/least-items`,
        { params: { ...params, limit } }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const useCancelledItems = (params: AnalyticsParams, limit = 10) =>
  useQuery({
    queryKey: analyticsKeys.cancelledItems({ ...params, limit }),
    queryFn: async () => {
      const { data } = await api.get<CancelledItemDTO[]>(
        `${BASE_URL}/menu/cancelled-items`,
        { params: { ...params, limit } }
      );
      return data;
    },
    enabled: hasRange(params),
  });

// ── Customers ────────────────────────────────────────────────────────────────

export const useCustomerSummary = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.customerSummary(params),
    queryFn: async () => {
      const { data } = await api.get<CustomerSummaryDTO>(
        `${BASE_URL}/customers/summary`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const useTopCustomers = (params: AnalyticsParams, limit = 10) =>
  useQuery({
    queryKey: analyticsKeys.topCustomers({ ...params, limit }),
    queryFn: async () => {
      const { data } = await api.get<TopCustomerDTO[]>(
        `${BASE_URL}/customers/top`,
        { params: { ...params, limit } }
      );
      return data;
    },
    enabled: hasRange(params),
  });

// ── Staff ────────────────────────────────────────────────────────────────────

export const useOrdersPerWaiter = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.waiters(params),
    queryFn: async () => {
      const { data } = await api.get<StaffPerformanceDTO[]>(
        `${BASE_URL}/staff/waiters`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

export const useRevenuePerCashier = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.cashiers(params),
    queryFn: async () => {
      const { data } = await api.get<StaffPerformanceDTO[]>(
        `${BASE_URL}/staff/cashiers`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });

// ── Tables ───────────────────────────────────────────────────────────────────

export const useTableActivity = (params: AnalyticsParams) =>
  useQuery({
    queryKey: analyticsKeys.tableActivity(params),
    queryFn: async () => {
      const { data } = await api.get<TableActivityDTO[]>(
        `${BASE_URL}/tables/activity`,
        { params }
      );
      return data;
    },
    enabled: hasRange(params),
  });