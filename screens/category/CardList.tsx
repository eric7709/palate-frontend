import { useGetAllCategories } from '@/models/category/hooks'
import { useGetAllMenuItems } from '@/models/menuItem/hooks'
import PageInfoCard from '@/ui/PageInfoCard'
import { LayoutGrid, UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react'

export default function CardList() {

    const { data: categories } = useGetAllCategories()
    const { data: menuItems } = useGetAllMenuItems()

    const available = categories?.content.filter(el => el.status === "AVAILABLE").length ?? 0
    const unavailable = categories?.content.filter(el => el.status === "UNAVAILABLE").length ?? 0

    const datas = [
        {
            label: "Total Categories",
            value: categories?.content?.length ?? 0,
            icon: <LayoutGrid size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "Total Menu Items",
            value: menuItems?.content.length ?? 0,
            icon: <UtensilsCrossed size={14} />,
            iconBg: "bg-green-600"
        },
        {
            label: "Available",
            value: available,
            icon: <CheckCircle size={14} />,
            iconBg: "bg-purple-600"
        },
        {
            label: "Unavailable",
            value: unavailable,
            icon: <XCircle size={14} />,
            iconBg: "bg-orange-600"
        }
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {datas.map((el) => (
                <PageInfoCard key={el.label} data={el} />
            ))}
        </div>
    )
}