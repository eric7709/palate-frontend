"use client";
import { CustomerOrderDTO } from "@/models/order/types";
import { CheckCircle, Clock, Package, XCircle, DollarSign, RotateCcw } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  PREPARING: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50", icon: Package },
  COMPLETED: { label: "Completed", color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
  PAID: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-50", icon: DollarSign },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

interface HistoryCardProps {
  order: CustomerOrderDTO;
  onReorder?: (order: CustomerOrderDTO) => void;
}

export default function HistoryCard({ order, onReorder }: HistoryCardProps) {
  const status = statusConfig[order.orderStatus] ?? {
    label: order.orderStatus,
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: Clock,
  };
  const StatusIcon = status.icon;
  const canReorder = order.orderStatus === "COMPLETED" || order.orderStatus === "PAID";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      
      {/* Top accent line in gray (optional, remove if you don't want) */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${status.bg} border border-gray-100`}>
              <StatusIcon className={`w-4 h-4 ${status.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 tracking-tight">#{order.invoiceNumber}</p>
              <p className="text-[11px] text-gray-500">{order.quantity} item{order.quantity !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold ${status.bg} ${status.color} border-gray-100`}>
              {status.label}
            </span>
            <p className="text-[10px] text-gray-500 mt-1 flex items-center justify-end gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(order.orderDate)}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">
                  {item.quantity}
                </span>
                <span className="text-gray-700">{item.menuItemName ?? `Item #${item.menuItemId}`}</span>
              </div>
              <span className="text-gray-700 tabular-nums font-mono text-[11px]">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-base font-bold text-gray-900 tabular-nums tracking-tight">
            ₦{order.total.toLocaleString()}
          </span>
        </div>

        {/* Reorder */}
        {canReorder && onReorder && (
          <button
            onClick={() => onReorder(order)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl transition-all text-sm font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder</span>
          </button>
        )}
      </div>
    </div>
  );
}