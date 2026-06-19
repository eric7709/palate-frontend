"use client"
import { useOrderStore } from '@/src/orders';
import DateDropdown from '@/src/shared/components/utils/DateDropdown';
import { usePathname } from 'next/navigation';

export  function CashierNavDatePicker() {
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
