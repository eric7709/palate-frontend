"use client"
import PageInfoCard from '@/src/shared/components/utils/PageInfoCard'
import { useGetAllOrders } from '../../../hooks/hooks.api';
import { useOrderStore } from '../../../store';

export function CardList() {
    const { status, waiterId, cashierId, tableId, minTotal, maxTotal, startDate, endDate, sortBy, sortDirection, roomId } = useOrderStore()

    const { data } = useGetAllOrders({
        page: 0,
        size: 20,
        search: "",
        status,
        waiterId,
        cashierId,
        roomId,
        tableId,
        minTotal,
        maxTotal,
        startDate,
        endDate,
        sortBy,
        sortDirection,
    });

    const statusCounts = data?.statusCounts

    const cards = [
        { 
            label: "Pending", 
            value: statusCounts?.pending ?? 0, 
            unit: "", 
            // Replaced icon with a micro badge string layout
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">PEND</span>, 
            colorScheme: { bg: "bg-amber-500", icon: "text-amber-900", value: "text-amber-900" } 
        },
        { 
            label: "Preparing", 
            value: statusCounts?.preparing ?? 0, 
            unit: "", 
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">PREP</span>, 
            colorScheme: { bg: "bg-indigo-500", icon: "text-indigo-900", value: "text-indigo-900" } 
        },
        { 
            label: "Completed", 
            value: statusCounts?.completed ?? 0, 
            unit: "", 
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">DONE</span>, 
            colorScheme: { bg: "bg-emerald-500", icon: "text-emerald-900", value: "text-emerald-900" } 
        },
        { 
            label: "Paid", 
            value: statusCounts?.paid ?? 0, 
            unit: "", 
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">PAID</span>, 
            colorScheme: { bg: "bg-green-500", icon: "text-green-900", value: "text-green-900" } 
        },
        { 
            label: "Cancelled", 
            value: statusCounts?.cancelled ?? 0, 
            unit: "", 
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">CANC</span>, 
            colorScheme: { bg: "bg-red-500", icon: "text-red-900", value: "text-red-900" } 
        },
        { 
            label: "Total", 
            value: statusCounts?.total ?? 0, 
            unit: "₦", 
            icon: <span className="text-[10px] font-extrabold  tracking-wider uppercase opacity-80">ALL</span>, 
            colorScheme: { bg: "bg-blue-500", icon: "text-blue-900", value: "text-blue-900" } 
        },
    ]

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2'>
            {cards.map((card) => (
                <PageInfoCard
                    key={card.label}
                    data={{ label: card.label, value: card.value, unit: card.unit, icon: card.icon }}
                    bg={card.colorScheme.bg}
                    iconColor={card.colorScheme.icon}
                    valueColor={card.colorScheme.value}
                />
            ))}
        </div>
    )
}