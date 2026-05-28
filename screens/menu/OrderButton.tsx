// OrderButton.tsx
"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderButton() {
  const { setModal, setCustomerId, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCustomerId(Number(localStorage.getItem("id")));
    setCustomerName(localStorage.getItem("name") || "");
    setCustomerTitle(localStorage.getItem("title") || "");
    setCustomerPhoneNumber(localStorage.getItem("phone") || "");
  }, [setCustomerId, setCustomerName, setCustomerTitle, setCustomerPhoneNumber]);

  if (!isClient || totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <button
        onClick={() => setModal("confirm")}
        className="w-full bg-gray-900 text-white py-3 px-5 rounded-full font-bold flex items-center justify-between shadow-lg active:scale-[0.98] transition-all"
      >
        <span className="text-xs opacity-75">{totalQuantity} items</span>
        <span className="flex items-center gap-2">
          Checkout
          <ArrowRight className="w-4 h-4" />
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-extrabold">
          ₦{totalPrice.toLocaleString()}
        </span>
      </button>
    </div>
  );
}