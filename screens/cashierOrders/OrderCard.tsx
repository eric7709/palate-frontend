"use client";
import { useRef, useState } from "react";
import { useUpdateOrderStatus } from "@/models/order/hooks";
import { OrderResponseDTO, OrderStatus } from "@/models/order/types";
import { Package, Coffee, Printer, Clock, ChevronRight } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Invoice from "../menu/Invoice";
import { useAuthStore } from "@/models/auth/store";

const STATUS_CYCLE: OrderStatus[] = ["PENDING", "PREPARING", "COMPLETED"];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; badgeBg: string }> = {
  PENDING:    { bg: "bg-amber-50", text: "text-amber-700", badgeBg: "bg-amber-100" },
  PREPARING:  { bg: "bg-blue-50", text: "text-blue-700", badgeBg: "bg-blue-100" },
  COMPLETED:  { bg: "bg-emerald-50", text: "text-emerald-700", badgeBg: "bg-emerald-100" },
  PAID:       { bg: "bg-green-50", text: "text-green-700", badgeBg: "bg-green-100" },
  CANCELLED:  { bg: "bg-red-50", text: "text-red-700", badgeBg: "bg-red-100" },
};

const getRelativeTime = (isoDate: string): string => {
  const now = new Date();
  const past = new Date(isoDate);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
};

const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  const idx = STATUS_CYCLE.indexOf(current);
  if (idx === -1 || idx === STATUS_CYCLE.length - 1) return null;
  return STATUS_CYCLE[idx + 1];
};

export function OrderCard({ order }: { order: OrderResponseDTO }) {
  const { mutate } = useUpdateOrderStatus();
  const { user } = useAuthStore();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: invoiceRef, documentTitle: "Invoice" });

  const [pendingAction, setPendingAction] = useState<"cycle" | "cancel" | "cash" | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  const statusStyles = STATUS_STYLES[order.status];
  const isFinal = order.status === "PAID" || order.status === "CANCELLED";
  const nextStatus = getNextStatus(order.status);
  const relativeTime = getRelativeTime(order.createdAt);

  const isWaiter = user?.role === "ROLE_WAITER";
  const isCashPayable = order.status === "COMPLETED" && isWaiter;

  const handleCycleStatus = () => {
    if (!nextStatus) return;
    setPendingAction("cycle");
    mutate(
      { id: order.id, dto: { status: nextStatus } },
      { onSettled: () => setPendingAction(null) }
    );
  };

  const handleCashPayment = () => {
    setPendingAction("cash");
    mutate(
      { id: order.id, dto: { status: "PAID" } },
      { onSettled: () => setPendingAction(null) }
    );
  };

  const handleCancel = () => {
    setPendingAction("cancel");
    mutate(
      { id: order.id, dto: { status: "CANCELLED" } },
      {
        onSuccess: () => setShowCancel(false),
        onSettled: () => setPendingAction(null),
      }
    );
  };

  return (
    <div className="relative flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
      {/* Cancel Overlay – light theme */}
      {showCancel && (
        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 bg-white rounded-xl p-4 shadow-lg border border-slate-200">
            <p className="text-slate-800 text-xs font-bold">Cancel this order?</p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={pendingAction === "cancel"}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase transition-all hover:bg-red-600 disabled:opacity-50"
              >
                {pendingAction === "cancel" ? "..." : "Cancel Order"}
              </button>
              <button
                onClick={() => setShowCancel(false)}
                disabled={pendingAction === "cancel"}
                className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase transition-all hover:bg-slate-200 disabled:opacity-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        onDoubleClick={() => !isFinal && setShowCancel(prev => !prev)}
        className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/30"
      >
        <div>
          <h2 className="font-bold text-slate-800 text-sm">#{order.invoiceNumber}</h2>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] text-slate-500">{relativeTime}</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusStyles.badgeBg} ${statusStyles.text}`}>
          {order.status}
        </span>
      </div>

      {/* Meta information */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 px-4 py-3 bg-white border-b border-slate-100">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Table</p>
          <p className="text-sm font-medium text-slate-800">{order.table?.tableName ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Customer</p>
          <p className="text-sm font-medium text-slate-800">{order.customer?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Waiter</p>
          <p className="text-sm font-medium text-slate-800">{order.waiter?.fullName ?? "—"}</p>
        </div>
      </div>

      {/* Items list – flex-1 to take available space */}
      <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-slate-500">{item.quantity}×</span>
              <span className="text-slate-700 truncate">{item.menuItemName ?? "Unknown item"}</span>
              {item.takeOut ? (
                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                  <Package className="w-2.5 h-2.5" /> Takeout
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                  <Coffee className="w-2.5 h-2.5" /> Dine in
                </span>
              )}
            </div>
            <span className="text-slate-800 font-mono text-xs font-semibold whitespace-nowrap ml-2">
              ₦{(item.price ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Footer – mt-auto to stay at bottom */}
      <div className="mt-auto px-4 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between gap-3">
        <div className="text-slate-900 font-bold text-base">₦{order.total.toLocaleString()}</div>

        <div className="flex items-center gap-2">
          {/* Print button */}
          {(order.status === "COMPLETED" || order.status === "PAID") && (
            <button
              onClick={handlePrint}
              className="rounded-full p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Print invoice"
            >
              <Printer size={16} />
            </button>
          )}

          {/* Cash payment (waiter only, completed orders) */}
          {isCashPayable && (
            <button
              onClick={handleCashPayment}
              disabled={pendingAction === "cash"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white text-[10px] font-bold uppercase transition-all hover:bg-green-700 disabled:opacity-50"
            >
              {pendingAction === "cash" ? "..." : "Cash"}
            </button>
          )}

          {/* Cycle status button */}
          {!isFinal && nextStatus ? (
            <button
              onClick={handleCycleStatus}
              disabled={pendingAction === "cycle"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${statusStyles.bg} ${statusStyles.text} hover:opacity-80 disabled:opacity-50`}
            >
              {pendingAction === "cycle" ? "..." : `Mark as ${nextStatus}`}
              <ChevronRight className="w-3 h-3" />
            </button>
          ) : isFinal ? (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
              Finalized
            </span>
          ) : null}
        </div>
      </div>

      {/* Hidden Invoice component */}
      <div style={{ display: "none" }}>
        <Invoice
          ref={invoiceRef}
          order={order}
          currentDateTime={new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        />
      </div>
    </div>
  );
}