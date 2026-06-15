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
  
  const statusConfig = [
    { label: 'All', value: data?.totalOrders || 0, color: 'bg-slate-700', icon: LayoutGrid },
    { label: 'Pending', value: data?.pending || 0, color: 'bg-yellow-700', icon: AlarmClock },
    { label: 'Preparing', value: data?.preparing || 0, color: 'bg-blue-700', icon: CookingPot },
    { label: 'Completed', value: data?.completed || 0, color: 'bg-teal-700', icon: CheckCheck },
    { label: 'Paid', value: data?.paid || 0, color: 'bg-green-700', icon: CreditCard },
    { label: 'Cancelled', value: data?.cancelled || 0, color: 'bg-red-700', icon: Ban },
  ];
  
  const { status, setStatus } = useOrderStore();

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
      {statusConfig.map((item) => (
        <button
          key={item.label}
          onClick={() => setStatus(item.label === 'All' ? null : (item.label.toUpperCase() as OrderStatus))}
          className={`${item.color} px-4 py-4 rounded-xl flex items-center justify-between transition-all ${
            (status === null && item.label === 'All') || status === item.label.toUpperCase()
              ? 'ring-2 ring-white scale-[1.02]'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          <span className="flex items-center gap-2 text-[11px] uppercase font-bold text-white/90">
            <item.icon className="w-3.5 h-3.5" /> {item.label}
          </span>
          <span className="text-lg font-semibold text-white">{item.value}</span>
        </button>
      ))}
    </div>
  );
}