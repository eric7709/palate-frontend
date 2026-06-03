import { Plus } from "lucide-react"

type Props = {
    title: string
    onClick?: () => void
}

export default function AddButton({ title, onClick }: Props) {
    return (
        <button onClick={onClick} className="py-2 gap-1 flex items-center cursor-pointer duration-300 active:scale-90 rounded-full px-2.5 text-[12px] font-semibold    border-blue-500/30 border bg-linear-to-br from-blue-500/80 to-gray-950 text-white ">
            <Plus size={13} strokeWidth={4}/>
            <p>{title}</p>
        </button>
    )
}
