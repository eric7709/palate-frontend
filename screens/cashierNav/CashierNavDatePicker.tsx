import { useOrderStore } from '@/models/order/store';
import { CalendarIcon } from 'lucide-react'
import { usePathname } from 'next/navigation';

export default function CashierNavDatePicker() {
    const pathname = usePathname()

    if(!pathname.split("/").includes("orders")) return 
    
    const { startDate, setStartDate, setEndDate } = useOrderStore();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        console.log(date, "DTAE")
        setStartDate(date);
        setEndDate(date);
    };
    return (
        <div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <input
                    type="date"
                    value={startDate || ''}
                    onChange={handleDateChange}
                    className="bg-transparent text-xs text-white focus:outline-none"
                />
            </div>
        </div>
    )
}
