"use client";

import { loaderStyle } from "@/models/dashboard/style";
import { useGetAllOrders } from "@/models/order/hooks";
import { OrderResponseDTO } from "@/models/order/types";
import Loader from "@/ui/Loader";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return {
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      };
    case "PENDING":
      return {
        text: "text-amber-600",
        dot: "bg-amber-500",
      };
    case "CANCELLED":
      return {
        text: "text-rose-600",
        dot: "bg-rose-500",
      };
    default:
      return {
        text: "text-slate-600",
        dot: "bg-slate-500",
      };
  }
};

const getLocation = (order: OrderResponseDTO) => {
  if (order.table) return `Table ${order.table.tableNumber}`;
  if (order.room) return order.room.roomNumber;
  return "Takeout";
};

const getItems = (order: OrderResponseDTO) => {
  return order.items
    .map((item) => item.menuItemName)
    .filter(Boolean)
    .join(", ");
};

export function RecentOrdersCard() {
  const { data, isLoading } = useGetAllOrders({
    page: 0,
    size: 7,
    search: "",
    status: null,
    waiterId: null,
    cashierId: null,
    roomId: null,
    tableId: null,
    minTotal: null,
    maxTotal: null,
    startDate: null,
    endDate: null,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  if (isLoading) {
    return <Loader height="h-36" style={loaderStyle} />;
  }

  const orders = data?.orders.content ?? [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-800">Recent orders</h3>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Table – scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Invoice
              </th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Items
              </th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </th>
              <th className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Cashier
              </th>
              <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Total
              </th>
              <th className="px-5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const statusStyle = getStatusStyles(order.status);

              return (
                <tr
                  key={order.id}
                  className="transition-colors duration-150 hover:bg-slate-50/60"
                >
                  {/* Invoice */}
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium text-slate-800">
                      {order.invoiceNumber}
                    </span>
                  </td>

                  {/* Items – truncated with ellipsis */}
                  <td className="px-5 py-3">
                    <span className="block max-w-[180px] truncate text-xs text-slate-600" title={getItems(order)}>
                      {getItems(order) || "—"}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-3 text-xs text-slate-700">
                    {order.customer?.name || "—"}
                  </td>

                  {/* Cashier */}
                  <td className="px-5 py-3 text-xs text-slate-700">
                    {order.cashier?.fullName || "—"}
                  </td>

                  {/* Total – right aligned */}
                  <td className="px-5 py-3 text-right text-xs font-semibold text-slate-900">
                    ₦{order.total.toLocaleString()}
                  </td>

                  {/* Status – dot + text, font-semibold */}
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                      <span className={`text-xs font-semibold ${statusStyle.text}`}>
                        {order.status}
                      </span>
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-3 text-xs font-medium text-slate-700">
                    {getLocation(order)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state (if no orders) */}
      {orders.length === 0 && (
        <div className="py-8 text-center text-xs text-slate-400">
          No recent orders found.
        </div>
      )}
    </div>
  );
}