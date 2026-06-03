"use client"
import { useGetAllOrders } from '@/models/order/hooks'
import { useOrderStore } from '@/models/order/store'
import PageInfoCard from '@/ui/PageInfoCard'
import { ShoppingBag, Clock, ChefHat, CheckCircle, DollarSign, XCircle } from 'lucide-react'

export default function OrderCardList() {
    const { status, waiterId, cashierId, tableId, minTotal, maxTotal, startDate, endDate, sortBy, sortDirection } = useOrderStore()

    const { data } = useGetAllOrders({
        page: 0,
        size: 1,
        search: "",
        status,
        waiterId,
        cashierId,
        tableId,
        minTotal,
        maxTotal,
        startDate,
        endDate,
        sortBy,
        sortDirection,
    })

    const statusCounts = data?.statusCounts

    const cards = [
        { label: "Total", value: statusCounts?.total ?? 0, icon: <ShoppingBag size={14} />, iconBg: "bg-blue-600" },
        { label: "Pending", value: statusCounts?.pending ?? 0, icon: <Clock size={14} />, iconBg: "bg-yellow-600" },
        { label: "Preparing", value: statusCounts?.preparing ?? 0, icon: <ChefHat size={14} />, iconBg: "bg-indigo-600" },
        { label: "Completed", value: statusCounts?.completed ?? 0, icon: <CheckCircle size={14} />, iconBg: "bg-emerald-600" },
        { label: "Paid", value: statusCounts?.paid ?? 0, icon: <DollarSign size={14} />, iconBg: "bg-green-600" },
        { label: "Cancelled", value: statusCounts?.cancelled ?? 0, icon: <XCircle size={14} />, iconBg: "bg-red-600" },
    ]

    return (
        <div className='grid grid-cols-6 gap-2'>
            {cards.map((card) => (
                <PageInfoCard key={card.label} data={card} />
            ))}
        </div>
    )
}