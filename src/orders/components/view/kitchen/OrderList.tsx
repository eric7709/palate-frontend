"use client"
import { ClipboardX } from "lucide-react";
import { OrderGridSkeleton } from "@/src/shared/components/utils/OrderCardSkeleton";
import { OrderCard } from "../../shared/OrderCard";
import { useGetPreparingOrdersToday } from "../../../hooks/hooks.api";

export function OrderList() {
  const { data, isLoading } = useGetPreparingOrdersToday();

  if (isLoading) return <OrderGridSkeleton />;

  const orders = data ?? [];

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-500">
      <ClipboardX className="w-8 h-8 opacity-40" />
      <p className="text-sm">No preparing orders</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-100 lg:grid-cols-4 gap-2 p-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}