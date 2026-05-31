import PageTitle from '@/ui/PageTitle'
import { Filter, RefreshCcw } from 'lucide-react'

export default function Header() {
    return (
        <div className='flex items-center gap-2'>
            <PageTitle subTitle='Manage your restaurant orders' title='Orders ' />
            <div className="flex ml-auto bg-red-600 cursor-pointer duration-300 active:scale-90 items-center gap-2 text-white border font-medium shadow shadow-gray-300 rounded-full border-white px-3 py-1.75 text-sm">
                <RefreshCcw size={14} strokeWidth={3} />
                <p>Refresh</p>
            </div>
            <div className="flex bg-blue-600 cursor-pointer duration-300 active:scale-90 items-center gap-2 text-white border shadow shadow-gray-300 rounded-full border-white px-3 py-1.75 font-medium text-sm">
                <Filter size={14} strokeWidth={3} />
                <p>Filter</p>
            </div>

        </div>
    )
}
