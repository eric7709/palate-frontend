"use client";
import { X } from "lucide-react";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useCustomerOrders } from "@/models/order/hooks";

export default function HistoryHeader() {
  const { setModal } = useOrderRequestStore();
    const { orders } = useCustomerOrders();
  
  const activeOrdersCount = orders.filter(
    (order) => order.orderStatus !== "PAID" && order.orderStatus !== "CANCELLED"
  ).length;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900">Order History</h2>
        {activeOrdersCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full leading-none">
            {activeOrdersCount}
          </span>
        )}
      </div>
      <button
        onClick={() => setModal(null)}
        className="p-1.5 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-500"
        aria-label="Close history"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}