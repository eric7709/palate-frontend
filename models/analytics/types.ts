export interface AnalyticsParams {
  startDate: string; // ISO-8601 e.g. "2025-01-01T00:00:00Z"
  endDate: string;
}

// ── Revenue ──────────────────────────────────────────────────────────────────

export interface RevenueSummaryDTO {
  totalRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
}

export interface RevenueOverTimeDTO {
  period: string; // ISO-8601 instant — granularity resolved by backend
  revenue: number;
  orderCount: number;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "COMPLETED"
  | "PAID"
  | "CANCELLED";

export interface OrdersByStatusDTO {
  status: OrderStatus;
  count: number;
}

export interface PeakHourDTO {
  hour: number; // 0–23
  count: number;
}

// ── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItemPerformanceDTO {
  itemId: number;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CancelledItemDTO {
  itemId: number;
  itemName: string;
  cancelCount: number;
}

// ── Customers ────────────────────────────────────────────────────────────────

export interface CustomerSummaryDTO {
  newCustomers: number;
  returningCustomers: number;
}

export interface TopCustomerDTO {
  customerId: number;
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

// ── Staff ────────────────────────────────────────────────────────────────────

export interface StaffPerformanceDTO {
  staffId: number;
  staffName: string;
  orderCount: number;
  totalValue: number;
}

// ── Tables ───────────────────────────────────────────────────────────────────

export interface TableActivityDTO {
  tableId: number;
  tableName: string;
  tableNumber: number;
  orderCount: number;
  totalRevenue: number;
}