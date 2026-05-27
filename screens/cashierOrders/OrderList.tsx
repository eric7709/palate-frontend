"use client"
import { useGetAllOrders } from "@/models/order/hooks";
import { OrderCard } from "./OrderCard";
import { useOrderStore } from "@/models/order/store";
import { useAuthStore } from "@/models/auth/store";
import Loader from "@/ui/Loader";

export function OrderList() {
  
  const { startDate, status, endDate } = useOrderStore();
  const auth = useAuthStore(state => state)
  const role = auth.user?.role
  const cashierId = auth ? role == "ROLE_CASHIER" ? auth.user!.id : null : null
  const waiterId = auth ? role == "ROLE_WAITER" ? auth.user!.id : null : null

  const { data, isLoading } = useGetAllOrders({
    page: 0,
    size: 20,
    search: "",
    status: status,
    waiterId,
    cashierId,
    tableId: null,
    minTotal: null,
    maxTotal: null,
    startDate,
    endDate,
    sortBy: "createdAt",
    sortDirection: "desc"
  });

  if(isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
      {data?.orders?.content?.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}