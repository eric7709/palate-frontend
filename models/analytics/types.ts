// ─── Primitives ────────────────────────────────────────────────────────────

export interface AccountSalesDTO {
  id: number;
  name: string;
  totalSales: number;
  orderCount: number;
}

export interface TableSalesDTO {
  id: number;
  tableName: string;
  tableNumber: number;
  totalSales: number;
  orderCount: number;
}

export interface CategorySalesDTO {
  id: number;
  name: string;
  totalSales: number;
  totalQuantity: number;
}

export interface MenuItemSalesDTO {
  id: number;
  name: string;
  categoryName: string;
  totalSales: number;
  totalQuantity: number;
}

export interface CustomerSalesDTO {
  id: number;
  name: string;
  phoneNumber: string | null;
  totalSales: number;
  orderCount: number;
}

export interface DaySalesDTO {
  dayName: string;
  orderCount: number;
  totalSales: number;
}

export interface HourSalesDTO {
  hour: number;        // 0–23
  orderCount: number;
  totalSales: number;
}

export interface DailyRevenueDTO {
  date: string;        // ISO date string e.g. "2024-03-15"
  orderCount: number;
  totalSales: number;
}

// ─── Request ───────────────────────────────────────────────────────────────

export interface AnalyticsRequestDTO {
  from: string;        // ISO date e.g. "2024-01-01"
  to: string;          // ISO date e.g. "2024-12-31"
  limit?: number;      // defaults to 10 on the backend
}

// ─── Main response ─────────────────────────────────────────────────────────

export interface AnalyticsSummaryByDTO {
  // KPIs
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  averageItemsPerOrder: number;
  cancelledOrders: number;
  cancellationRate: number; 
  newCustomers: number;
  returningCustomers: number;

  // Top by sales
  topWaitersBySales: AccountSalesDTO[];
  topCashiersBySales: AccountSalesDTO[];
  topTablesBySales: TableSalesDTO[];
  topCategoriesBySales: CategorySalesDTO[];
  topMenuItemsBySales: MenuItemSalesDTO[];
  topCustomersBySales: CustomerSalesDTO[];

  // Top by count
  topWaitersByCount: AccountSalesDTO[];
  topCashiersByCount: AccountSalesDTO[];
  topTablesByCount: TableSalesDTO[];
  topCategoriesByCount: CategorySalesDTO[];
  topMenuItemsByCount: MenuItemSalesDTO[];
  topCustomersByCount: CustomerSalesDTO[];
  topCustomersByFrequency: CustomerSalesDTO[];

  // Least by sales
  leastWaitersBySales: AccountSalesDTO[];
  leastCashiersBySales: AccountSalesDTO[];
  leastTablesBySales: TableSalesDTO[];
  leastCategoriesBySales: CategorySalesDTO[];
  leastMenuItemsBySales: MenuItemSalesDTO[];

  // Least by count
  leastWaitersByCount: AccountSalesDTO[];
  leastCashiersByCount: AccountSalesDTO[];
  leastTablesByCount: TableSalesDTO[];
  leastCategoriesByCount: CategorySalesDTO[];
  leastMenuItemsByCount: MenuItemSalesDTO[];

  topRoomsBySales: RoomSalesDTO[];
  topRoomsByCount: RoomSalesDTO[];
  leastRoomsBySales: RoomSalesDTO[];
  leastRoomsByCount: RoomSalesDTO[];

  // Time-based
  salesByDay: DaySalesDTO[];
  salesByHour: HourSalesDTO[];
  revenueOverTime: DailyRevenueDTO[];

  // Order composition
  takeOutCount: number;
  takeOutRevenue: number;
  dineInCount: number;
  dineInRevenue: number;
}

export type RoomSalesDTO = {
  id: number;
  roomNumber: string;
  totalSales: number;
  orderCount: number;
};

export type RoomAnalyticsDTO = {
  // Top by sales
  
};

export interface AnalyticsDateStore {
    params: AnalyticsRequestDTO;
    setParams: (params: Partial<AnalyticsRequestDTO>) => void;
    setDateRange: (from: string, to: string) => void;
    reset: () => void;
}
