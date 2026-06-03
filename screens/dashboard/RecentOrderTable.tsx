"use client";
import { useGetAllOrders } from "@/models/order/hooks";
import { DollarSignIcon, ShoppingCart } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  PREPARING: "bg-blue-100 text-blue-800",
  SERVED: "bg-purple-100 text-purple-800",
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 0) return "Future date";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

export default function RecentOrderTable() {
  const tableHeaders = ["#", "Table", "Customer", "Total", "Status", "Time"];
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useGetAllOrders({
    page: 0,
    size: 8,
    search: "",
    status: null,
    waiterId: null,
    cashierId: null,
    tableId: null,
    minTotal: null,
    maxTotal: null,
    startDate: null,
    endDate: null,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const orders = ordersData?.orders.content ?? [];

  return (
    <div className="text-white bg-linear-to-br from-blue-500/20 to-gray-950 rounded-2xl border-blue-500/30 border">
      <div className="flex text-sm border-b border-blue-500/30 font-semibold items-center p-3 justify-between">
        <div>
          <p className="text-base">Recent Orders</p>
          <p className="font-normal text-[12px] text-gray-300">Latest Transactions</p>
        </div>
        <ShoppingCart size={24}/>
      </div>
      <table className="w-full text-sm font-normal">
        <thead>
          <tr>
            {tableHeaders.map((el, idx) => (
              <th key={idx} className="px-3 py-2 text-left font-medium">
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((el) => el.customer)
            .map((o, i) => (
              <tr key={o.id} className="hover:bg-gray-800/30 text-[12px]  transition-colors">
                <td className="px-3 py-2 font-mono text-xs text-gray-500">#{i+1}</td>
                <td className="px-3 py-2">{o.table?.tableName}</td>
                <td className="px-3 py-2 text-gray-300">
                  {o.customer?.title}. {o.customer?.name}
                </td>
                <td className="px-3 py-2 font-medium text-emerald-400">
                  {o.total.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                      STATUS_STYLES[o.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {formatRelativeTime(o.createdAt)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}