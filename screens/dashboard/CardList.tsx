import PageInfoCard from '@/ui/PageInfoCard'
import { icons, ShoppingBag } from 'lucide-react'

export default function CardList() {

    const data = [
        {
            percentage: 80,
            label: "Total Revenue",
            value: 30,
        },
        {
            percentage: 40,
            label: "Total Orders",
            value: 22,
        }
        ,
        {
            percentage: 65,
            label: "Customers ",
            value: 120,
            icon: <ShoppingBag size={14}/>,
            iconBg: "bg-blue-600"
        }
        ,
        {
            percentage: 23,
            label: "Average Orders",
            value: 320,
        }
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {data.map((el) => (
                <PageInfoCard data={el}/>
            ))}
        </div>
    )
}
