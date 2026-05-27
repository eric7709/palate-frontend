"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  title?: string;
  message?: string;
}

export default function SuccessModal({
  title = "Order Successful",
  message = "The order has been sent to the kitchen."
}: SuccessModalProps) {
  const { modal, setModal } = useOrderRequestStore();
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal === 'success') {
        setModal(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal, setModal]);

  if (modal !== "success") return null;

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-200"
      onClick={(e) => e.target === e.currentTarget && setModal(null)}
    >
      <div className="relative bg-gradient-to-br from-[#1a1c21] to-[#0f1115] border border-emerald-500/30 rounded-xl p-5 w-full max-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-emerald-500/5 blur-xl -z-10" />
        
        <div className="relative">
          {/* Animated icon container */}
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center rounded-full mb-3 shadow-lg animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-sm" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-lg font-bold text-white mb-1.5 tracking-tight">{title}</h2>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">{message}</p>
          
          <button
            onClick={() => setModal(null)}
            className="group relative w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-md hover:shadow-emerald-500/25 text-sm"
          >
            <span className="relative z-10">Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}