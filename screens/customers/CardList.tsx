import PageInfoCard from '@/ui/PageInfoCard'
import { icons, MonitorCheck, ShoppingBag, StopCircle, User } from 'lucide-react'

export default function CardList() {

    const data = [
        {
            label: "Total Revenue",
            value: 30,
            icon: <ShoppingBag size={14} />,
            iconBg: "bg-blue-600"
        },
        {
            label: "Total Orders",
            value: 22,
            icon: <MonitorCheck size={14} />,
            iconBg: "bg-green-600"
        }
        ,
        {
            label: "Customers ",
            value: 120,
            icon: <User size={14} />,
            iconBg: "bg-purple-600"
        }
        ,
        {
            label: "Average Orders",
            value: 320,
            icon: <StopCircle size={14} />,
            iconBg: "bg-orange-600"
        }
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {data.map((el) => (
                <PageInfoCard data={el} />
            ))}
        </div>
    )
}
