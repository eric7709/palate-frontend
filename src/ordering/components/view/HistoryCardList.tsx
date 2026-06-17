'use client';

import { useCustomerOrders } from "../../hooks/hooks.api";
import { HistoryCard } from "./HistoryCard";

export  function HistoryCardList() {
  const { orders } = useCustomerOrders()

  if (!orders.length) return <div>No orders today</div>;

  return (
    <div className="space-y-4 p-4">
      {orders.map((order, idx) => (
        <HistoryCard key={order.invoiceNumber || idx} order={order} />
      ))}
    </div>
  );
}