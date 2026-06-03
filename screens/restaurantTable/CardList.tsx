"use client"
import { useGetAllTables } from '@/models/restaurantTable/hooks'
import PageInfoCard from '@/ui/PageInfoCard'
import { TableProperties, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TableCardList() {
    const { data } = useGetAllTables({ page: 0, size: 1000 });
    const tables = data?.content || [];

    const total = tables.length;
    const available = tables.filter(t => t.status === "AVAILABLE").length;
    const occupied = tables.filter(t => t.status === "OCCUPIED").length;
    const reserved = tables.filter(t => t.status === "RESERVED").length;

    const cards = [
        {
            label: "Total Tables",
            value: total,
            icon: <TableProperties size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "Available",
            value: available,
            icon: <CheckCircle size={14} />,
            iconBg: "bg-green-600"
        },
        {
            label: "Occupied",
            value: occupied,
            icon: <XCircle size={14} />,
            iconBg: "bg-red-600"
        },
        {
            label: "Reserved",
            value: reserved,
            icon: <Clock size={14} />,
            iconBg: "bg-amber-600"
        },
    ];

    return (
        <div className='grid grid-cols-4 gap-2'>
            {cards.map((card) => (
                <PageInfoCard key={card.label} data={card} />
            ))}
        </div>
    );
}