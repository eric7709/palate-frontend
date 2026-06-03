"use client"
import { useGetAllCustomers } from '@/models/customer/hooks'
import PageInfoCard from '@/ui/PageInfoCard'
import { Users, UserCheck, Mail, Phone } from 'lucide-react'

export default function CustomerCardList() {
    const { data } = useGetAllCustomers({ page: 0, size: 1000 })
    const customers = data?.content || []

    const withEmail = customers.filter(c => c.email).length
    const withPhone = customers.filter(c => c.phoneNumber).length

    const cards = [
        {
            label: "Total Customers",
            value: customers.length,
            icon: <Users size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "With Email",
            value: withEmail,
            icon: <Mail size={14} />,
            iconBg: "bg-purple-600"
        },
        {
            label: "With Phone",
            value: withPhone,
            icon: <Phone size={14} />,
            iconBg: "bg-green-600"
        },
        {
            label: "Today",
            value: 0,
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