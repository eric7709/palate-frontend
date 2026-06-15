"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useEffect, useState } from "react";
import { Check, Clock, Sparkles } from "lucide-react";

interface SuccessModalProps {
  title?: string;
  message?: string;
  onViewOrders?: () => void;
}

export default function SuccessModal({
  title = "Order placed",
  message = "Your order has been sent to the kitchen. We'll have it ready shortly.",
  onViewOrders,
}: SuccessModalProps) {
  const { modal, setModal } = useOrderRequestStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (modal === "success") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [modal]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal === "success") setModal(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modal, setModal]);

  if (modal !== "success") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && setModal(null)}
    >
      <div
        className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Decorative top gradient bar */}
        <div className="h-2 bg-linear-to-r from-green-400 via-green-500 to-green-600" />

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Animated checkmark circle */}
          <div className="relative  w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-full border-2 border-green-500 bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
            {/* Sparkle accent */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          <p className="text-lg font-bold text-gray-900 mb-2">{title}</p>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>

          {/* Estimated time hint */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            <span>Estimated 15–20 minutes</span>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
          {onViewOrders && (
            <button
              onClick={() => {
                setModal("history");
                onViewOrders?.();
              }}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              View orders
            </button>
          )}
          <button
            onClick={() => setModal(null)}
            className={`flex-1 py-3 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm ${
              onViewOrders ? "" : "flex-1"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}