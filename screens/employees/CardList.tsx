"use client"
import { useGetAllEmployees } from '@/models/employee/hooks'
import PageInfoCard from '@/ui/PageInfoCard'
import { Users, ShieldCheck, UtensilsCrossed, UserCheck } from 'lucide-react'

export default function EmployeeCardList() {
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
            icon: <Users size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "Admins",
            value: admins,
            icon: <ShieldCheck size={14} />,
            iconBg: "bg-purple-600"
        },
        {
            label: "Waiters",
            value: waiters,
            icon: <UtensilsCrossed size={14} />,
            iconBg: "bg-green-600"
        },
        {
            label: "Cashiers",
            value: cashiers,
            icon: <UserCheck size={14} />,
            iconBg: "bg-orange-600"
        },
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {cards.map((card) => (
                <PageInfoCard key={card.label} data={card} />
            ))}
        </div>
    )
}