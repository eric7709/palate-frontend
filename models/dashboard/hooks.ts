// dashboard.hooks.ts
import { useGet } from "@/utils/hook";
import {
  DashboardSummaryDTO,
  HourlyRevenueResponseDTO,
  QuickStatsResponse,
  RevenueSplitResponse,
  TopMenuItemResponse,
  TopCategoryResponse,
  DashboardPeriod,
} from "./types";

const BASE_URL = "/dashboard";

// ==========================================
// DASHBOARD SUMMARY
// ==========================================
export const useDashboardSummary = (
  period: DashboardPeriod = "THIS_MONTH"
) =>
  useGet<DashboardSummaryDTO>(
    ["dashboard-summary", period],
    `${BASE_URL}/summary?period=${period}`
  );

// ==========================================
// HOURLY REVENUE
// ==========================================
export const useHourlyRevenue = (
  period: DashboardPeriod = "TODAY"
) =>
  useGet<HourlyRevenueResponseDTO>(
    ["hourly-revenue", period],
    `${BASE_URL}/hourly-revenue?period=${period}`
  );

// ==========================================
// QUICK STATS
// ==========================================
export const useQuickStats = (
  period: DashboardPeriod = "TODAY"
) =>
  useGet<QuickStatsResponse>(
    ["quick-stats", period],
    `${BASE_URL}/quick-stats?period=${period}`
  );

// ==========================================
// REVENUE SPLIT
// ==========================================
export const useRevenueSplit = (
  period: DashboardPeriod = "THIS_MONTH"
) =>
  useGet<RevenueSplitResponse>(
    ["revenue-split", period],
    `${BASE_URL}/revenue-split?period=${period}`
  );

// ==========================================
// TOP MENU ITEMS
// ==========================================
export const useTopMenuItems = (
  period: DashboardPeriod = "THIS_MONTH",
  limit = 10
) =>
  useGet<TopMenuItemResponse>(
    ["top-menu-items", period, limit],
    `${BASE_URL}/top-menu-items?period=${period}&limit=${limit}`
  );

// ==========================================
// TOP CATEGORIES
// ==========================================
export const useTopCategories = (
  period: DashboardPeriod = "THIS_MONTH",
  limit = 5
) =>
  useGet<TopCategoryResponse>(
    ["top-categories", period, limit],
    `${BASE_URL}/top-categories?period=${period}&limit=${limit}`
  );