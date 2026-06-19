'use client';

import { Inbox } from "lucide-react";
import { useCustomerOrders } from "../../hooks/hooks.api";
import { HistoryCard } from "./HistoryCard";

export function HistoryCardList() {
  const { orders } = useCustomerOrders()

  if (!orders.length) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-500">
        <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
        <span className="text-xs font-medium">No order activity recorded for today.</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4">
      {orders.map((order, idx) => (
        <HistoryCard key={order.invoiceNumber || idx} order={order} />
      ))}
    </div>
  );
}