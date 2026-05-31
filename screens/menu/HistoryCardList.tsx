'use client';
import { useOrderHistoryStore } from "@/models/customer/store.history";
import HistoryCard from "./HistoryCard";

export default function HistoryCardList() {
  const { orders } = useOrderHistoryStore();

  if (!orders.length) return <div>No orders today</div>;

  return (
    <div className="space-y-4 p-4">
      {orders.map((order, idx) => (
        <HistoryCard key={order.invoiceNumber || idx} order={order} />
      ))}
    </div>
  );
}