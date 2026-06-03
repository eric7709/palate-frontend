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
    const val = label == "Total" ? `₦${value.toLocaleString()}`: value
    return (
        <div className="relative  border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 overflow-hidden text-white rounded-4xl text-sm p-4 ">
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
            <p className="text-xl text-end font-semibold z-20 relative">{val}</p>
            <p className="z-20 relative text-xs">{label}</p>
        </div>
    )
}
