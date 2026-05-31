// models/analytics/keys.ts

import { AnalyticsParams } from "./types";

export const analyticsKeys = {
  all: () => ["analytics"] as const,

  // Revenue
  revenueSummary:  (p: AnalyticsParams) => ["analytics", "revenue", "summary",   p] as const,
  revenueOverTime: (p: AnalyticsParams) => ["analytics", "revenue", "over-time", p] as const,

  // Orders
  ordersByStatus: (p: AnalyticsParams) => ["analytics", "orders", "by-status",  p] as const,
  peakHours:      (p: AnalyticsParams) => ["analytics", "orders", "peak-hours", p] as const,

  // Menu
  topItems:       (p: AnalyticsParams & { limit?: number }) => ["analytics", "menu", "top-items",       p] as const,
  leastItems:     (p: AnalyticsParams & { limit?: number }) => ["analytics", "menu", "least-items",     p] as const,
  cancelledItems: (p: AnalyticsParams & { limit?: number }) => ["analytics", "menu", "cancelled-items", p] as const,

  // Customers
  customerSummary: (p: AnalyticsParams)                      => ["analytics", "customers", "summary", p] as const,
  topCustomers:    (p: AnalyticsParams & { limit?: number }) => ["analytics", "customers", "top",     p] as const,

  // Staff
  waiters:  (p: AnalyticsParams) => ["analytics", "staff", "waiters",  p] as const,
  cashiers: (p: AnalyticsParams) => ["analytics", "staff", "cashiers", p] as const,

  // Tables
  tableActivity: (p: AnalyticsParams) => ["analytics", "tables", "activity", p] as const,
};