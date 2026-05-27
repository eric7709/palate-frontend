"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  title?: string;
  message?: string;
}

export default function SuccessModal({
  title = "Order Successful",
  message = "The order has been sent to the kitchen."
}: SuccessModalProps) {
  const { modal, setModal } = useOrderRequestStore()
  if (modal != "success") return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1c21] border border-emerald-500/20 p-8 rounded-2xl w-full max-w-sm shadow-2xl text-center animate-in fade-in zoom-in duration-200">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 flex items-center justify-center rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-8">{message}</p>
        <button
          onClick={() => {
            setModal(null)
          }}
          className="w-full py-3 bg-white text-[#1a1c21] hover:bg-gray-200 font-bold rounded-xl transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}