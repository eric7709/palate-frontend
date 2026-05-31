export interface DashboardStats {
    totalRevenue: number;
    revenueGrowthPercent: number;
    totalOrders: number;
    ordersGrowthPercent: number;
    totalCustomers: number;
    customersGrowthPercent: number;
    avgOrderValue: number;
    avgOrderGrowthPercent: number;
}

export interface DashboardParams {
    from: string; // yyyy-MM-dd e.g. "2024-11-01"
    to: string;   // yyyy-MM-dd e.g. "2024-11-30"
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