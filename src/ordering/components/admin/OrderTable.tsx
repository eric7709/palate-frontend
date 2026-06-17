"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { TableSkeleton } from "@/src/shared/components/TableSkeleton";
import NoRecords from "@/src/shared/components/NoRecords"; // 👈 import NoRecords
import { OrderResponseDTO, OrderStatus } from "../../types";
import { useOrderStore } from "../../store";
import { useGetAllOrders } from "../../hooks/hooks.api";
import { OrderDetailsModal } from "./OrderDetailsModal";


const statusBadgeStyle = (status?: OrderStatus) => {
  const base = "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium";

  const map: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200/70",
    PREPARING: "bg-blue-50 text-blue-700 border border-blue-200/70",
    COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    PAID: "bg-green-50 text-green-700 border border-green-200/70",
    CANCELLED: "bg-red-50 text-red-700 border border-red-200/70",
  };

  return `${base} ${map[status ?? "PENDING"]}`;
};

const statusDotColor = (status?: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    PENDING: "bg-amber-500",
    PREPARING: "bg-blue-500",
    COMPLETED: "bg-emerald-500",
    PAID: "bg-green-500",
    CANCELLED: "bg-red-500",
  };
  return map[status ?? "PENDING"];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const locationLabel = (order: OrderResponseDTO) => {
  if (order.table) return order.table.tableName;
  if (order.room) return `Room ${order.room.roomNumber}`;
  return "Takeout";
};

export  function OrderTable() {
  const {
    page,
    size,
    search,
    status,
    waiterId,
    cashierId,
    roomId,
    tableId,
    minTotal,
    maxTotal,
    startDate,
    endDate,
    sortBy,
    sortDirection,
  } = useOrderStore();

  const { data, isLoading } = useGetAllOrders({
    page,
    size,
    search,
    status,
    waiterId,
    cashierId,
    roomId,
    tableId,
    minTotal,
    maxTotal,
    startDate,
    endDate,
    sortBy,
    sortDirection,
  });

  console.log(data, "ORDES")
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const orders = data?.orders?.content ?? [];

  if (isLoading) {
    return <TableSkeleton rows={5} columns={8} />;
  }

  if (!orders.length) {
    return (
      <NoRecords
        title="No orders found"
        description="Try adjusting your filters or create a new order."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Invoice</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Location</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Waiter</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cashier</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold text-slate-900">{order.invoiceNumber}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {(order.customer?.name || "G").charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs font-medium text-slate-800">{order.customer?.name || "Guest"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {locationLabel(order)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-slate-800">{order.waiter?.fullName || "—"}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-slate-800">{order.cashier?.fullName || "—"}</p>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-emerald-600">{formatCurrency(order.total)}</p>
                      <p className="text-[10px] text-slate-400">{order.quantity} item(s)</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={statusBadgeStyle(order.status)}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColor(order.status)}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
}