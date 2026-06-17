"use client";
import { useRef, useState } from "react";
import { Package, Coffee, Printer, Clock, ChevronRight, BedDouble, HelpCircle, LayoutGrid, AlertTriangle, StickyNote } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { OrderResponseDTO, OrderStatus } from "../../types";
import { useUpdateOrderStatus } from "../../hooks/hooks.api";
import { Invoice } from "../view/Invoice";

const STATUS_CYCLE: OrderStatus[] = ["PENDING", "PREPARING", "COMPLETED", "PAID"];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; badgeBg: string; border: string }> = {
  PENDING:    { bg: "bg-amber-50", text: "text-amber-700", badgeBg: "bg-amber-50 border border-amber-200", border: "border-l-amber-500" },
  PREPARING:  { bg: "bg-blue-50", text: "text-blue-700", badgeBg: "bg-blue-50 border border-blue-200", border: "border-l-blue-500" },
  COMPLETED:  { bg: "bg-emerald-50", text: "text-emerald-700", badgeBg: "bg-emerald-50 border border-emerald-200", border: "border-l-emerald-500" },
  PAID:       { bg: "bg-green-50", text: "text-green-700", badgeBg: "bg-green-50 border border-green-200", border: "border-l-green-500" },
  CANCELLED:  { bg: "bg-red-50", text: "text-red-700", badgeBg: "bg-red-50 border border-red-200", border: "border-l-red-500" },
};

const UNDERPAID_STYLES = {
  bg: "bg-orange-50",
  text: "text-orange-700",
  badgeBg: "bg-orange-50 border border-orange-200",
  border: "border-l-orange-500",
};

const NEXT_ACTION_STYLES: Record<Extract<OrderStatus, "PREPARING" | "COMPLETED" | "PAID">, string> = {
  PREPARING: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
  COMPLETED: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white",
  PAID:      "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white",
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
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
};

const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  const idx = STATUS_CYCLE.indexOf(current);
  if (idx === -1 || idx === STATUS_CYCLE.length - 1) return null;
  return STATUS_CYCLE[idx + 1];
};

export function OrderCard({ order }: { order: OrderResponseDTO }) {
  const { mutate } = useUpdateOrderStatus();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: invoiceRef, documentTitle: `Invoice-${order.invoiceNumber}` });

  const [pendingAction, setPendingAction] = useState<"cycle" | "cancel" | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  // Underpayment is a display concern, not a real status — the actual
  // lifecycle stage (order.status) never changes because of it.
  const isUnderpaidPending = Boolean(order.isUnderpaid) && order.status === "PENDING";

  const statusStyles = isUnderpaidPending ? UNDERPAID_STYLES : STATUS_STYLES[order.status];
  const displayLabel = isUnderpaidPending ? "UNDERPAID" : order.status;

  const isFinal = order.status === "PAID" || order.status === "CANCELLED";
  const nextStatus = getNextStatus(order.status);
  const relativeTime = getRelativeTime(order.createdAt);

  const handleCycleStatus = () => {
    if (!nextStatus) return;
    setPendingAction("cycle");
    mutate(
      { id: order.id, dto: { status: nextStatus } },
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
    <div className={`relative flex flex-col w-full rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-md overflow-hidden ${statusStyles.border} border-l-4`}>

      {/* Cancellation Overlay */}
      {showCancel && (
        <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="flex flex-col items-center text-center gap-4 bg-white rounded-xl p-5 shadow-xl border border-slate-100 max-w-xs w-full animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <HelpCircle size={20} />
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-sm">Cancel Order?</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Are you sure you want to flag invoice #{order.invoiceNumber} as cancelled?</p>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <button
                onClick={handleCancel}
                disabled={pendingAction === "cancel"}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-xs font-medium tracking-wide transition-all hover:bg-rose-700 active:scale-98 disabled:opacity-50"
              >
                {pendingAction === "cancel" ? "Processing..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setShowCancel(false)}
                disabled={pendingAction === "cancel"}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium tracking-wide transition-all hover:bg-slate-200 active:scale-98"
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
        className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50 select-none cursor-pointer"
        title={!isFinal ? "Double click to cancel order" : undefined}
      >
        <div>
          <h2 className="font-bold text-slate-900 text-sm tracking-tight">#{order.invoiceNumber}</h2>
          <div className="flex items-center gap-1 mt-0.5 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium text-slate-500">{relativeTime}</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${statusStyles.badgeBg} ${statusStyles.text}`}>
          {displayLabel}
        </span>
      </div>

      {/* Dynamic Metadata Section */}
      <div className={`grid gap-x-2 px-4 py-2.5 bg-white border-b border-slate-100 ${order.room ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <div>
          {order.room ? (
            <>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                <BedDouble size={10} className="text-indigo-500 shrink-0" /> Room
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                R-{order.room.roomNumber} <span className="text-[10px] font-normal text-slate-400">({order.room.floor ?? 0}F)</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                <LayoutGrid size={10} className="text-slate-400 shrink-0" /> Table
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                {order.table?.tableName ?? "—"}
              </p>
            </>
          )}
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Customer</p>
          <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{order.customer?.name ?? "—"}</p>
        </div>

        {/* Only rendered if it's a table order */}
        {!order.room && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Waiter</p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{order.waiter?.fullName ?? "—"}</p>
          </div>
        )}
      </div>

      {/* Scrollable Items List */}
      <div className="flex-1 px-4 py-2.5 space-y-2 overflow-y-auto bg-slate-50/20 scrollbar-thin">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-2 text-xs py-1 border-b border-slate-100/40 last:border-0">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-indigo-600 shrink-0">{item.quantity}×</span>
                <span className="font-medium text-slate-700 truncate">{item.menuItemName ?? "Unknown Item"}</span>
              </div>
              <div>
                {item.takeOut ? (
                  <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 text-[9px] font-medium px-1.5 py-0.5 rounded-md border border-amber-200/40">
                    <Package className="w-2.5 h-2.5" /> Takeout
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-medium px-1.5 py-0.5 rounded-md border border-emerald-200/40">
                    <Coffee className="w-2.5 h-2.5" /> Dine in
                  </span>
                )}
              </div>
            </div>
            <span className="text-slate-800  text-xs font-semibold pt-0.5 shrink-0">
              ₦{(item.price ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Note */}
      {order.note && (
        <div className="px-4 py-2.5 bg-blue-50/50 border-t border-blue-100 flex items-start gap-2">
          <StickyNote className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600">Note</p>
            <p className="text-xs text-blue-800 font-medium leading-snug mt-0.5">{order.note}</p>
          </div>
        </div>
      )}

      {/* Underpayment Notice */}
      {order.isUnderpaid && (
        <div className="px-4 py-2.5 bg-orange-50 border-t border-orange-100 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">Underpaid</p>
            <p className="text-xs text-orange-800 font-medium leading-snug mt-0.5">
              Paid ₦{order.paidAmount?.toLocaleString() ?? 0} of ₦{order.total.toLocaleString()} ·{" "}
              ₦{order.remainingBalance?.toLocaleString()} remaining
            </p>
          </div>
        </div>
      )}

      {/* Footer Grid */}
      <div className="mt-auto px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
          <p className="text-slate-900 font-bold text-base tracking-tight">₦{order.total.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Print Trigger */}
          {(order.status === "COMPLETED" || order.status === "PAID") && (
            <button
              onClick={handlePrint}
              className="rounded-xl p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 transition-all active:scale-95"
              title="Print invoice"
            >
              <Printer size={15} />
            </button>
          )}

          {/* Dynamic Action Button */}
          {!isFinal && nextStatus ? (
            <button
              onClick={handleCycleStatus}
              disabled={pendingAction === "cycle"}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-xs transition-all duration-200 active:scale-95 disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${
                NEXT_ACTION_STYLES[nextStatus as keyof typeof NEXT_ACTION_STYLES] || "bg-indigo-600 text-white"
              }`}
            >
              {pendingAction === "cycle" ? "..." : `Mark as ${nextStatus}`}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : isFinal ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200/60 px-3 py-2 rounded-xl select-none">
              Archived & Paid
            </span>
          ) : null}
        </div>
      </div>

      {/* Printable Frame Overlay */}
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