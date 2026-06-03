'use client';
import { useGetOrderSummary } from '@/models/order/hooks';
import Logo from '@/ui/Logo';
import CashierHeaderMenu from './WaiterHeaderMenu';
import CashierNavTotal from './WaiterNavTotal';

export default function WaiterNav() {
  const { data } = useGetOrderSummary();
  return (
    <header className="bg-black/10 backdrop-blur-xl border-b border-white/10 w-full sticky top-0 z-50">
      <div className="max-w-400 mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo white/>
          <div className="flex items-center gap-6">
            <CashierNavTotal amount={data?.totalAmount} />
            <CashierHeaderMenu />
          </div>
        </div>
      </div>
    </header>
  );
}