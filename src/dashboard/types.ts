export type DashboardPeriod = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR' | null;
export interface FloorStatusDTO {
  tables: number;
  rooms: number;
}

export interface ActiveOrdersDTO {
  pending: number;
  paid: number;
}

export interface MenuItemsDTO {
  active: number;
  unavailable: number;
}

export interface DashboardSummaryDTO {
  totalRevenue: number;
  previousRevenue: number;
  activeOrders: ActiveOrdersDTO;
  menuItems: MenuItemsDTO;
  floorStatus: FloorStatusDTO;
}

export interface HourlyRevenueDTO {
  hour: string;
  value: number;
  display: string;
  color: string;
}

export interface HourlyRevenueResponseDTO {
  data: HourlyRevenueDTO[];
  totalRevenue: number;
  previousTotal: number;
  changePercent: number;
}

export interface QuickStatsResponse {
  stats: StatItem[];
}

export interface StatItem {
  label: string;
  value: string;
  sub: string;
}

export interface RevenueSplitResponse {
  data: RevenueSplitItem[];
  restaurantShare: number;
}

export interface RevenueSplitItem {
  label: string;
  value: string;
  percent: number;
}

export interface TopCategoryResponse {
  items: CategoryItem[];
}

export interface CategoryItem {
  rank: number;
  name: string;
  value: string;
  pct: number;
  color: string;
}

export interface Item {
  rank: number;
  name: string;
  value: string;
  pct: number;
  color: string;
}

export interface TopMenuItemResponse {
  items: Item[];
}