"use client"
import { useGetAllCategories } from '@/src/categories/hooks/hooks.api';
import { useGetAllMenuItems } from '@/src/menuItems/hooks/hooks.api'
import PageInfoCard from '@/src/shared/components/PageInfoCard'
import { UtensilsCrossed, CheckCircle, XCircle, LayoutGrid } from 'lucide-react'

export function CardList() {
    const { data } = useGetAllMenuItems({ page: 0, size: 1000 }); 
    const { data: categories } = useGetAllCategories()
    const menuItems = data?.content || [];

    const total = menuItems.length ?? 0;
    const available = menuItems.filter(item => item.status === "AVAILABLE").length ?? 0;
    const unavailable = menuItems.filter(item => item.status === "UNAVAILABLE").length ?? 0;

    const cards = [
        {
            label: "Total Menu Items",
            value: total,
            icon: <UtensilsCrossed size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "Available",
            value: available,
            icon: <CheckCircle size={14} />,
            iconBg: "bg-green-600"
        },
        {
            label: "Unavailable",
            value: unavailable,
            icon: <XCircle size={14} />,
            iconBg: "bg-orange-600"
        },
        {
            label: "Categories", // optional: maybe fetch categories count
            value: categories?.content.length ?? 0, // placeholder; could fetch separately
            icon: <LayoutGrid size={14} />,
            iconBg: "bg-purple-600"
        }
    ];

    return (
        <div className='grid grid-cols-4 gap-2'>
            {cards.map((card, index) => (
                <PageInfoCard key={card.label} index={index} data={card} />
            ))}
        </div>
    );
}