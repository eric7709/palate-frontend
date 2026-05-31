type Props = {
    data: {
        label: string
        count: number
        amount: number
        percentage: number
        icon: any
    }
}

export default function Card({ data: {amount, count, icon, label, percentage}}: Props) {
    return (
        <div className="flex text-xs gap-2 items-center">
            <div className="flex h-7 w-7 rounded-sm bg-emerald-500 items-center justify-center">
                {icon}
            </div>
            <div className="flex flex-col text-white flex-1">
                <p className="text-[13px] font-semibold">{label}</p>
                <p className="text-gray-300 text-[11px]">{count} orders</p>
            </div>
            <div className="flex flex-col justify-end items-end text-end text-emerald-500 ">
                <p className="text-[13px] font-semibold">${amount.toLocaleString()}</p>
                <p className="text-[11px] ">{percentage}%</p>
            </div>
        </div>
    )
}
