'use client';
import HistoryCard from "./HistoryCard";
import { useCustomerOrders } from "@/models/order/hooks";

export default function HistoryCardList() {
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