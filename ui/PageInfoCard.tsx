import { ArrowRight, DollarSign, ShoppingBag } from "lucide-react";

type Props = {
    data: {
        percentage?: number
        label: string
        value: number
        icon?: any
        iconBg?: string
    }
}


export default function PageInfoCard({data:  {label, value, icon, percentage, iconBg} }: Props) {
    return (
        <div className="border relative shadow shadow-gray-300 border-white overflow-hidden text-white rounded-xl text-sm p-4 bg-linear-to-b from-gray-950 to-gray-800">
            <div className="h-36 w-36 rounded-full bg-gray-900 absolute -top-16 -right-10"></div>
            {icon ?
                <div className="flex z-20 relative">
                    <div className={`p-1.5 ${iconBg} rounded w-fit flex self-end`}>
                        {icon}
                    </div>
                </div>
                :
                <div className="flex text-green-500 justify- z-20 relative items-center text-xs font-semibold">
                    <ArrowRight className="-rotate-45" size={14} />
                    <p>{percentage}%</p>
                </div>
            }
            <p className="text-3xl text-end font-semibold z-20 relative">{value}</p>
            <p className="z-20 relative text-xs">{label}</p>
        </div>
    )
}
