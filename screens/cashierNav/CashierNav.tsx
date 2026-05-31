'use client';
import { usePathname } from 'next/navigation';
import { useGetOrderSummary } from '@/models/order/hooks';
import CashierNavStatus from './CashierNavStatus';
import CashierNavDropdown from './CashierNavDropdown';
import CashierNavTotal from './CashierNavTotal';
import CashierNavAvatar from './CashierNavAvatar';
import Logo from '@/ui/Logo';
import CashierNavDatePicker from './CashierNavDatePicker';

export default function CashierNav() {
  const pathname = usePathname();
  const { data } = useGetOrderSummary();

  return (
    <header className="bg-black/10 backdrop-blur-xl border-b border-white/10 w-full sticky top-0 z-50">
      <div className="max-w-400 mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo white/>
          <div className="flex items-center gap-6">
            <CashierNavDatePicker />
            <CashierNavDropdown />
            <CashierNavTotal amount={data?.totalAmount} />
            <CashierNavAvatar />
          </div>
        </div>
        {pathname === '/cashier/orders' && (
          <CashierNavStatus />
        )}
      </div>
    </header>
  );
}