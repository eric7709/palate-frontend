"use client";
import { useRef, useState } from "react";
import { useUpdateOrderStatus } from "@/models/order/hooks";
import { OrderResponseDTO, OrderStatus } from "@/models/order/types";
import { Package, Coffee, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Invoice from "../menu/Invoice";

// ✅ CANCELLED removed — it's only reachable via explicit cancel action
const STATUS_CYCLE: OrderStatus[] = ["PENDING", "PREPARING", "COMPLETED", "PAID"];

const STATUS_COLORS: Record<OrderStatus, { bg: string; border: string; text: string }> = {
    PENDING: { bg: "bg-yellow-500", border: "border-yellow-500/20", text: "text-yellow-400" },
    PREPARING: { bg: "bg-blue-500", border: "border-blue-500/20", text: "text-blue-400" },
    COMPLETED: { bg: "bg-emerald-500", border: "border-emerald-500/20", text: "text-emerald-400" },
    PAID: { bg: "bg-green-500", border: "border-green-500/20", text: "text-green-400" },
    CANCELLED: { bg: "bg-red-500", border: "border-red-500/20", text: "text-red-400" },
};

const META_FIELDS = (order: OrderResponseDTO) => [
    { label: "TABLE", value: order.table?.tableName ?? "—" },
    { label: "TIME", value: new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    { label: "CUSTOMER", value: order.customer?.name ?? "—" },
    { label: "WAITER", value: order.waiter?.fullName ?? "—" },
];

export function OrderCard({ order }: { order: OrderResponseDTO }) {
    const { mutate, isPending } = useUpdateOrderStatus();

    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: "Invoice",
    });


    // ✅ Separate pending state per action so they don't block each other
    const [pendingAction, setPendingAction] = useState<"cycle" | "cancel" | null>(null);
    const [showCancel, setShowCancel] = useState(false);

    const { bg, border, text } = STATUS_COLORS[order.status];
    const isFinal = order.status === "PAID" || order.status === "CANCELLED";

    const handleCycleStatus = () => {
        const currentIndex = STATUS_CYCLE.indexOf(order.status);
        // ✅ Explicit guard: not in cycle (e.g. CANCELLED) or already at end
        if (currentIndex === -1 || currentIndex === STATUS_CYCLE.length - 1) return;

        const nextStatus = STATUS_CYCLE[currentIndex + 1];
        setPendingAction("cycle");
        mutate(
            { id: order.id, dto: { status: nextStatus } },
            { onSettled: () => setPendingAction(null) }
        );
    };

    function getCurrentDateTime(): string {
        return new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }

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
        <div className="relative flex flex-col rounded-xl border border-white/10 bg-[#1a1c21] overflow-hidden shadow-2xl transition-all hover:border-indigo-500/50">

            {/* Cancel Overlay */}
            {showCancel && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-white text-xs font-bold">Cancel this order?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={pendingAction === "cancel"}
                                className="px-4 py-1.5 rounded-lg bg-red-500 border border-red-500/20 text-white text-[10px] font-bold uppercase transition-all disabled:opacity-50"
                            >
                                {pendingAction === "cancel" ? "..." : "Cancel Order"}
                            </button>
                            <button
                                onClick={() => setShowCancel(false)}
                                disabled={pendingAction === "cancel"}
                                className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase transition-all hover:bg-white/20 disabled:opacity-50"
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
                className="flex items-center justify-between px-3 py-3 border-b border-white/5 bg-white/2 select-none cursor-default"
            >
                <h2 className="font-bold text-white text-xs">#{order.invoiceNumber}</h2>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${text} bg-transparent ${border}`}>
                    {order.status}
                </span>
            </div>

            {/* Meta Data — ✅ stable label as key */}
            <div className="grid grid-cols-2 gap-px bg-white/5">
                {META_FIELDS(order).map((m) => (
                    <div key={m.label} className="bg-[#1a1c21] px-3 py-2">
                        <p className="text-[12px] text-gray-500 font-bold">{m.label}</p>
                        <p className="text-[14px] font-semibold text-white truncate">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Items — ✅ stable item id as key, guarded price */}
            <div className="px-4 py-2 flex-1">
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[12px] py-1">
                        <div className="flex items-center gap-1.5 flex-1">
                            <span className="font-bold text-gray-400">{item.quantity}×</span>
                            <span className="text-gray-300 truncate">{item.menuItemName ?? "Unknown item"}</span>
                            {item.takeOut ? (
                                <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                                    <Package className="w-2.5 h-2.5" /> Takeout
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                                    <Coffee className="w-2.5 h-2.5" /> Dine in
                                </span>
                            )}
                        </div>
                        {/* ✅ Guard against undefined price */}
                        <span className="text-white font-mono text-[12px] whitespace-nowrap ml-2">
                            ₦{(item.price ?? 0).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-white font-bold text-[14px]">
                    ₦{order.total.toLocaleString()}
                </div>
                {order.status == "COMPLETED" || order.status == "PAID" && <div onClick={handlePrint} className="cursor-pointer border rounded-full border-white p-1 hover:border-blue-600 duration-300 hover:scale-105 active:scale-95">
                    <Printer color="white" size={16} />
                </div>
                }
                <button
                    onClick={handleCycleStatus}
                    disabled={pendingAction === "cycle" || isFinal}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-2xl border text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed duration-300 active:scale-90 cursor-pointer ${bg} ${border}`}
                >
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                        {pendingAction === "cycle" ? "..." : order.status}
                    </span>
                </button>
                <div style={{ display: "none" }}>
                    <Invoice
                        ref={invoiceRef}
                        order={order}
                        currentDateTime={getCurrentDateTime()}
                    />
                </div>
            </div>
        </div>
    );
}