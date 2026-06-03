"use client"
import { useGetDashboardTopStats } from '@/models/dashboard/hooks';
import Wrapper from './Wrapper'
import { Crown, Table } from 'lucide-react'
import { useDashboardStore } from '@/models/dashboard/store';

export default function TopCategories() {
    const { startDate, endDate } = useDashboardStore()
    const {
        data: topData, isLoading: topLoading,
        isError: topError, refetch: refetchTop,
    } = useGetDashboardTopStats({ from: startDate, to: endDate, limit: 5 });

    const cardItems = topData?.topCategories.map(el => {
        return {
            label: el.categoryName,
            count: el.salesCount,
            amount: el.revenue,
            percentage: el.growthPercent,
            icon: <Crown size={16} />
        }
    }) || []

    const data = {
        title: {
            text: "Top Categories",
            icon: <Table size={14} />
        },
        cardItems
    }
    return <Wrapper data={data} />
}
