"use client";
import { X } from "lucide-react";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useOrderRequestStore } from "@/models/orderRequest/store";

export default function CartHeader() {
  const { setModal } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-baseline gap-2">
        <h2 className="text-gray-800 font-semibold text-base">Cart</h2>
        <div className="h-4 w-px bg-gray-300" />
        <span className="text-sm text-gray-500">
          {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
        </span>
        <span className="text-sm text-emerald-600 font-medium">
          ₦{totalPrice.toLocaleString()}
        </span>
      </div>
      <button
        onClick={() => setModal(null)}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}