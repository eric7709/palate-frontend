"use client"
import { useOrderStore } from '@/models/order/store';
import DateDropdown from '@/ui/DateDropdown';
import { CalendarIcon } from 'lucide-react'
import { usePathname } from 'next/navigation';

export default function CashierNavDatePicker() {
    const pathname = usePathname()

    if (!pathname.split("/").includes("orders")) return

    const { setStartDate, setEndDate } = useOrderStore();

    const handleDateChange = (date: string) => {
        setStartDate(date);
        setEndDate(date);
    };
    return (
        <div>
            <DateDropdown onSelect={(date) => handleDateChange(date)} />
        </div>
    )
}
