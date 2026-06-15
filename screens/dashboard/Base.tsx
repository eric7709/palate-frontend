"use client"
import { RecentOrdersCard } from "./RecentOrdersCard";
import { RevenueSplitCard } from "./RevenueSplitCard";
import { QuickStatsCard } from "./QuickStatsCard";
import { HourlyRevenueChart } from "./HourlyRevenueChart";
import { TopCategories } from "./TopCategories";
import { TopMenuItems } from "./TopMenuItems";
import MetricCards from "./MetricCards";
import MenuItemFormModal from "../menuItems/MenuItemFormModal";
import { useDashboardSummary } from "@/models/dashboard/hooks";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { DashboardPeriod } from "@/models/dashboard/types";
import { useState } from "react";

export default function Base() {
    const [period, setPeriod] = useState<DashboardPeriod>("THIS_MONTH")
    
    const { data, isLoading } = useDashboardSummary(period);

    return (
        <div className="flex flex-col bg-white p-4 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_3fr] gap-4">
                <TotalRevenueCard setPeriod={setPeriod} period={period} data={data} isLoading={isLoading} />
                <MetricCards data={data} isLoading={isLoading} />
            </div>
            <MenuItemFormModal />
            <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                <div className="min-w-0">
                    <HourlyRevenueChart />
                </div>
                <RevenueSplitCard />
            </div>
            <div className="grid gap-4 grid-cols-3">
                <TopCategories />
                <TopMenuItems />
                <QuickStatsCard />
            </div>
            {/* Row 4: recent orders table */}
            <RecentOrdersCard />
        </div>
    );
}