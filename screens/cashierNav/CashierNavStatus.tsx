"use client";

import { useGetOrderSummary } from '@/models/order/hooks';
import { useOrderStore } from '@/models/order/store';
import { OrderStatus } from '@/models/order/types';
import { 
  LayoutGrid, AlarmClock, CookingPot, 
  CheckCheck, CreditCard, Ban 
} from 'lucide-react';

export default function CashierNavStatus() {
  const { data } = useGetOrderSummary();
  
  // 🟢 Back to vibrant, solid, punchy colors. No dim backgrounds.
  const statusConfig = [
    { label: 'All', value: data?.totalOrders || 0, color: 'bg-slate-600', icon: LayoutGrid },
    { label: 'Pending', value: data?.pending || 0, color: 'bg-amber-500', icon: AlarmClock },
    { label: 'Preparing', value: data?.preparing || 0, color: 'bg-blue-600', icon: CookingPot },
    { label: 'Completed', value: data?.completed || 0, color: 'bg-teal-600', icon: CheckCheck },
    { label: 'Paid', value: data?.paid || 0, color: 'bg-emerald-600', icon: CreditCard },
    { label: 'Cancelled', value: data?.cancelled || 0, color: 'bg-rose-600', icon: Ban },
  ];
  
  const { status, setStatus } = useOrderStore();

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
      {statusConfig.map((item) => {
        const isActive = (status === null && item.label === 'All') || status === item.label.toUpperCase();

        return (
          <button
            key={item.label}
            onClick={() => setStatus(item.label === 'All' ? null : (item.label.toUpperCase() as OrderStatus))}
            className={`${item.color} px-4 py-4 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer text-white shadow-xs ${
              isActive
                ? 'ring-4 ring-white border border-slate-200 scale-[1.03] z-10 font-black'
                : 'hover:scale-[1.01] hover:shadow-md'
            }`}
          >
            <span className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wide text-white">
              <item.icon className="w-4 h-4 shrink-0" /> {item.label}
            </span>
            <span className="text-lg font-bold font-mono text-white">{item.value}</span>
          </button>
        );
      })}
    </div>
  );
}