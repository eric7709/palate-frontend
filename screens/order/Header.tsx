import { useOrderStore } from '@/models/order/store'
import PageTitle from '@/ui/PageTitle'
import { Filter, RefreshCcw } from 'lucide-react'

export default function Header() {
    const { resetFilters } = useOrderStore()
    return (
        <div className='flex items-center gap-2'>
            <PageTitle subTitle='Manage your restaurant orders' title='Orders ' />
            <div onClick={resetFilters} className="flex ml-auto cursor-pointer duration-300 active:scale-90 items-center gap-2 text-white font-medium shadow px-3 py-1.75 text-[13px] border-white border bg-slate-600 rounded-3xl">
                <RefreshCcw size={11} strokeWidth={3} />
                <p>Refresh</p>
            </div>

            <div onClick={resetFilters} className="flex cursor-pointer duration-300 active:scale-90 items-center gap-2 text-white font-medium shadow px-3 py-1.75 text-[13px] border-white border bg-indigo-500 rounded-3xl">
                <Filter size={11} strokeWidth={3} />
                <p>Filter</p>
            </div>
        </div>
    )
}
