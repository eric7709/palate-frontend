export interface OrderHourDTO {
  hour: string;
  orders: number;
}

export interface TableAvgDTO {
  tableName: string;
  value: number;
}

export interface PeakHourDTO {
  time: string;
  count: number;
}

export interface DashboardDTO {
  hourlyVolume: OrderHourDTO[];
  tableAverages: TableAvgDTO[];
  totalOrdersToday: number;
  peakHour: PeakHourDTO;
}

export interface TopTable {
    tableId: number;
    tableName: string;
    tableNumber: number;
    revenue: number;
    orderCount: number;
    utilizationPercent: number;
    growthPercent: number;
}

export interface TopCategory {
    categoryId: number;
    categoryName: string;
    revenue: number;
    salesCount: number;
    growthPercent: number;
}

export interface TopItem {
    menuItemId: number;
    menuItemName: string;
    categoryName: string;
    revenue: number;
    salesCount: number;
    growthPercent: number;
}

export interface TopWaiter {
    waiterId: number;
    waiterName: string;
    revenue: number;
    orderCount: number;
    growthPercent: number;
}

export interface DashboardTopStats {
    topTables: TopTable[];
    topCategories: TopCategory[];
    topItems: TopItem[];
    topWaiters: TopWaiter[];
}

export interface DashboardTopParams {
    from: string; // yyyy-MM-dd
    to: string;   // yyyy-MM-dd
    limit?: number;
}

export interface DailyRevenue {
    date: string;       // "2024-11-01"
    revenue: number;
    orderCount: number;
}

export interface HourlyRevenue {
    hour: number;       // 0-23
    revenue: number;
    orderCount: number;
}

export interface DashboardChartStats {
    salesOverview: DailyRevenue[];
    revenueByHour: HourlyRevenue[];
}

export interface DashboardChartParams {
    from: string;   // yyyy-MM-dd
    to: string;     // yyyy-MM-dd
}

export type DashboardStore = {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
}