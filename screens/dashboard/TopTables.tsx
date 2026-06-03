"use client"
import { useGetDashboardTopStats } from '@/models/dashboard/hooks';
import Wrapper from './Wrapper'
import { Crown, Table } from 'lucide-react'
import { useDashboardStore } from '@/models/dashboard/store';

export default function TopTables() {
    const { startDate, endDate } = useDashboardStore()
    const {
        data: topData, isLoading: topLoading,
        isError: topError, refetch: refetchTop,
    } = useGetDashboardTopStats({ from: startDate, to: endDate, limit: 5 });

    const cardItems = topData?.topTables.map(el => {
        return {
            label: el.tableName,
            count: el.orderCount,
            amount: el.revenue,
            percentage: el.growthPercent,
            icon: <Crown size={16} />
        }
    }) || []

    const data = {
        title: {
            text: "Top Tables",
            icon: <Table size={14} />
        },
        cardItems
    }
    return <Wrapper data={data} />
}
