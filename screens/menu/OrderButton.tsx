"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderButton() {
  const { setModal, setCustomerId, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } =
    useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCustomerId(Number(localStorage.getItem("id")));
    setCustomerName(localStorage.getItem("name") || "");
    setCustomerTitle(localStorage.getItem("title") || "");
    setCustomerPhoneNumber(localStorage.getItem("phoneNumber") || "");
  }, [setCustomerId, setCustomerName, setCustomerTitle, setCustomerPhoneNumber]);

  if (!isClient || totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <button
        onClick={() => setModal("confirm")}
        className="w-full bg-gray-900 rounded-2xl px-5 py-3.5 flex items-center justify-between active:scale-[0.98] transition-all"
      >
        {/* Left — bag + label */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
              {totalQuantity}
            </span>
          </div>
          <span className="text-sm text-white/60">Checkout</span>
        </div>

        {/* Right — amount pill */}
        <div className="bg-emerald-600 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-[18px] font-medium text-white tracking-tight">
            ₦{totalPrice.toLocaleString()}
          </span>
          <ArrowRight className="w-4 h-4 text-white/80" />
        </div>
      </button>
    </div>
  );
}