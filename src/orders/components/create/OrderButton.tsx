"use client";
import { useOrderSummary } from "@/src/orders/hooks/hooks.api.request";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useOrderRequestStore } from "../../store/index.request";

export  function OrderButton() {
  const { setModal } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();

  if (totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <button
        onClick={() => setModal("CONFIRM")}
        className="w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-3 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-200 group"
      >
        {/* Left section: cart icon + quantity badge */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <ShoppingCart className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-semibold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-0.5">
              {totalQuantity}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">Your order</span>
        </div>

        {/* Right section: total amount + arrow */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900 tracking-tight">
            ₦{totalPrice.toLocaleString()}
          </span>
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </button>
    </div>
  );
}