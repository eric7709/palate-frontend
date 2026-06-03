"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useEffect } from "react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && setModal(null)}
    >
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-13 h-13 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900 dark:text-white mb-1.5">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
        </div>

        <div className="border-t border-gray-100 dark:border-neutral-800 px-6 py-4 flex gap-2">
          {onViewOrders && (
            <button
              onClick={() => { setModal("history"); onViewOrders?.(); }}
              className="flex-1 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 hover:bg-gray-100 transition-colors"
            >
              View orders
            </button>
          )}
          <button
            onClick={() => setModal(null)}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}