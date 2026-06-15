"use client"
import { useGetAllOrders } from "@/models/order/hooks";
import { OrderCard } from "./OrderCard";
import { useOrderStore } from "@/models/order/store";
import { useAuthStore } from "@/models/auth/store";
import Loader from "@/ui/Loader";
import { ClipboardX } from "lucide-react";
import { OrderGridSkeleton } from "@/ui/OrderCardSkeleton";

export function OrderList() {
  const { startDate, status, endDate } = useOrderStore();
  const auth = useAuthStore(state => state);
  const role = auth.user?.role;
  const cashierId = auth ? role === "ROLE_CASHIER" ? auth.user!.id : null : null;

  const { data, isLoading } = useGetAllOrders({
    page: 0,
    size: 100,
    search: "",
    status,
    waiterId: null,
    cashierId,
    roomId: null,
    tableId: null,
    minTotal: null,
    maxTotal: null,
    startDate,
    endDate,
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  console.log(data)



  if (isLoading) return <OrderGridSkeleton />;

  const orders = data?.orders?.content ?? [];

  console.log(orders)

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-500">
      <ClipboardX className="w-8 h-8 opacity-40" />
      <p className="text-sm">No orders found</p>
      {status && <p className="text-xs opacity-60">Try changing the status filter</p>}
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