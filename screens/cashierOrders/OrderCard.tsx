"use client"
import { useState } from "react";
import { useUpdateOrderStatus } from "@/models/order/hooks";
import { OrderResponseDTO, OrderStatus } from "@/models/order/types";

const STATUS_CYCLE: OrderStatus[] = [
    'PENDING', 'PREPARING', 'COMPLETED', 'PAID', "CANCELLED"
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; border: string; text: string }> = {
    PENDING: { bg: 'bg-yellow-500', border: 'border-yellow-500/20', text: 'text-yellow-400' },
    PREPARING: { bg: 'bg-blue-500', border: 'border-blue-500/20', text: 'text-blue-400' },
    COMPLETED: { bg: 'bg-emerald-500', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    PAID: { bg: 'bg-green-500', border: 'border-green-500/20', text: 'text-green-400' },
    CANCELLED: { bg: 'bg-red-500', border: 'border-red-500/20', text: 'text-red-400' },
};

export function OrderCard({ order }: { order: OrderResponseDTO }) {
    const { mutate, isPending } = useUpdateOrderStatus();
    const [showCancel, setShowCancel] = useState(false);

    const { bg, border, text } = STATUS_COLORS[order.orderStatus];
    const isFinal = order.orderStatus === 'PAID' || order.orderStatus === 'CANCELLED';

    const handleCycleStatus = () => {
        const currentIndex = STATUS_CYCLE.indexOf(order.orderStatus);
        if (currentIndex === -1 || currentIndex === STATUS_CYCLE.length - 1) return;
        const nextStatus = STATUS_CYCLE[currentIndex + 1];
        mutate({ id: order.id, dto: { orderStatus: nextStatus } });
    };

    const handleCancel = () => {
        mutate(
            { id: order.id, dto: { orderStatus: 'CANCELLED' } },
            { onSuccess: () => setShowCancel(false) }
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
                                disabled={isPending}
                                className="px-4 py-1.5 rounded-lg bg-red-500 border border-red-500/20 text-white text-[10px] font-bold uppercase transition-all disabled:opacity-50"
                            >
                                {isPending ? '...' : 'Cancel Order'}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowCancel(false); }}
                                className="px-4 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase transition-all hover:bg-white/20"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header — double click here to cancel */}
            <div
                onDoubleClick={() => !isFinal && setShowCancel(prev => !prev)}
                className="flex items-center justify-between px-3 py-3 border-b border-white/5 bg-white/2 select-none cursor-default"
            >
                <h2 className="font-bold text-white text-xs">#{order.invoiceNumber}</h2>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${text} bg-transparent ${border}`}>
                    {order.orderStatus}
                </span>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 gap-px bg-white/5">
                {[
                    { l: 'TABLE', v: order.table?.tableName ?? '—' },
                    { l: 'TIME', v: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                    { l: 'CUSTOMER', v: order.customer?.name ?? '—' },
                    { l: 'WAITER', v: order.waiter?.fullName ?? '—' },
                ].map((m, i) => (
                    <div key={i} className="bg-[#1a1c21] px-3 py-2">
                        <p className="text-[12px] text-gray-500 font-bold">{m.l}</p>
                        <p className="text-[14px] font-semibold text-white truncate">{m.v}</p>
                    </div>
                ))}
            </div>

            {/* Items */}
            <div className="px-4 py-2 flex-1">
                {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[12px] py-1">
                        <span className="text-gray-300">
                            <span className="font-bold mr-2">{item.quantity}×</span>
                            {item.menuItemName ?? 'Unknown item'}
                        </span>
                        <span className="text-white">{item.price}</span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-white font-bold text-[14px]">
                    ₦{order.total.toLocaleString()}
                </div>

                <button
                    onClick={handleCycleStatus}
                    disabled={isPending || isFinal}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-2xl border text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed duration-300 active:scale-90 cursor-pointer ${bg} ${border}`}
                >
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                        {isPending ? '...' : order.orderStatus}
                    </span>
                </button>
            </div>
        </div>
    );
}