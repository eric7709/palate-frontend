"use client";
import { X } from "lucide-react";
import { useOrderSummary } from "@/src/orders/hooks/hooks.api.request";
import { useOrderRequestStore } from "../../store/index.request";

export function CartHeader() {
  const { setModal } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-extrabold text-gray-900">Your Cart</h2>
        {totalQuantity > 0 && <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
          <span className="text-xs font-bold text-gray-600">{totalQuantity}</span>
          <span className="text-xs font-bold text-emerald-600">₦{totalPrice.toLocaleString()}</span>
        </div>
        }
      </div>
      <button
        onClick={() => setModal(null)}
        className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all text-gray-500"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}