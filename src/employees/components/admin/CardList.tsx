"use client"
import { useGetAllEmployees } from '@/src/employees/hooks/hooks.api'
import PageInfoCard from '@/src/shared/components/PageInfoCard'
import { Users, ShieldCheck, UtensilsCrossed, UserCheck } from 'lucide-react'

export  function CardList() {
    const { data } = useGetAllEmployees({ page: 0, size: 1000 })
    const employees = data?.content || []

    const total = employees.length
    const admins = employees.filter(e => e.role === "ROLE_ADMIN").length
    const waiters = employees.filter(e => e.role === "ROLE_WAITER").length
    const cashiers = employees.filter(e => e.role === "ROLE_CASHIER").length

    const cards = [
        {
            label: "Total Employees",
            value: total,
            max: 100,
            icon: <Users size={14} />,
            color: "#3B82F6",
        },
        {
            label: "Admins",
            value: admins,
            max: total || 1,
            icon: <ShieldCheck size={14} />,
            color: "#8B5CF6",
        },
        {
            label: "Waiters",
            value: waiters,
            max: total || 1,
            icon: <UtensilsCrossed size={14} />,
            color: "#10B981",
        },
        {
            label: "Cashiers",
            value: cashiers,
            max: total || 1,
            icon: <UserCheck size={14} />,
            color: "#F59E0B",
        },
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {cards.map((card, index) => (
                <PageInfoCard key={card.label} index={index} data={card} />
            ))}
        </div>
    )
}