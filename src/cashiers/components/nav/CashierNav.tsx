'use client';
import { usePathname } from 'next/navigation';
import Logo from '@/src/shared/components/Logo';
import { CashierNavDatePicker } from './CashierNavDatePicker';
import { CashierHeaderMenu } from './CashierHeaderMenu';
import { CashierNavTotal } from './CashierNavTotal';
import { CashierNavStatus } from './CashierNavStatus';
import { useGetOrderSummary } from '@/src/ordering';

export  function CashierNav() {
  const pathname = usePathname();
  const { data } = useGetOrderSummary();

  return (
    <header className="bg-slate-950 border-b border-gray-200 shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-400 mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo /> {/* No white prop – default colored/light version */}
          <div className="flex items-center gap-6">
            <CashierNavDatePicker />
            <CashierNavTotal amount={data?.totalAmount} />
            <CashierHeaderMenu />
          </div>
        </div>
        {pathname === '/cashier/orders' && (
          <CashierNavStatus />
        )}
      </div>
    </header>
  );
}