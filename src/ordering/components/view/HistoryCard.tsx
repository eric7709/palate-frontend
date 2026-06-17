"use client";
import { CheckCircle, Clock, Package, XCircle, DollarSign, RotateCcw, AlertTriangle } from "lucide-react";
import { useOrderRequestStore } from "@/src/ordering/store.request";
import { CustomerOrderDTO } from "../../types";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  PREPARING: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50", icon: Package },
  COMPLETED: { label: "Completed", color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
  PAID: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-50", icon: DollarSign },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const UNDERPAID_CONFIG = {
  label: "Underpaid",
  color: "text-orange-700",
  bg: "bg-orange-50",
  icon: AlertTriangle,
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function HistoryCard({ order }: { order: CustomerOrderDTO }) {
  const { setItems, setModal } = useOrderRequestStore();

  // Underpayment is a display concern, not a real status — the actual
  // lifecycle stage (order.orderStatus) never changes because of it.
  const isUnderpaidPending = Boolean(order.isUnderpaid) && order.orderStatus === "PENDING";

  const status = isUnderpaidPending
    ? UNDERPAID_CONFIG
    : statusConfig[order.orderStatus] ?? {
        label: order.orderStatus,
        color: "text-gray-600",
        bg: "bg-gray-100",
        icon: Clock,
      };

  const StatusIcon = status.icon;
  const canReorder = order.orderStatus === "COMPLETED" || order.orderStatus === "PAID";
  const showPaymentDetails =
    (order.orderStatus === "PENDING" || order.orderStatus === "PREPARING" || order.orderStatus === "COMPLETED")
    && order.virtualAccountNumber
    && order.virtualBankName;

  const amountDue = order.isUnderpaid && order.remainingBalance != null
    ? order.remainingBalance
    : order.total;

  const handleReorder = () => {
    const items = order.items
      .filter((item) => item.menuItemId !== null)
      .map((item) => ({
        menuItemId: item.menuItemId as number,
        quantity: item.quantity,
        price: item.price,
        name: item.menuItemName ?? "",
        takeOut: item.takeOut ?? false,
        status: "AVAILABLE" as const,
      }));
    setItems(items);
    setModal("CONFIRM");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

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
              <span className="text-gray-700 tabular-nums  text-[11px]">
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

        {/* Underpayment Notice */}
        {order.isUnderpaid && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">Underpayment Detected</p>
              <p className="text-xs text-orange-800 mt-0.5">
                We received a partial payment. Please transfer the remaining{" "}
                <span className="font-bold">₦{order.remainingBalance?.toLocaleString()}</span> below.
              </p>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {showPaymentDetails && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 space-y-2">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide text-center">
              Pay via Bank Transfer
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Bank</span>
                <span className="font-semibold text-gray-800">{order.virtualBankName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Account No</span>
                <span className="font-bold text-gray-900 tracking-widest ">
                  {order.virtualAccountNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-emerald-700">
                  ₦{amountDue.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 text-center">
              Transfer exact amount · Account expires in 24hrs
            </p>
          </div>
        )}

        {/* Reorder */}
        {canReorder && (
          <button
            onClick={handleReorder}
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