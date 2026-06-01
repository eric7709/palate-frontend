"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { AlertCircle, X } from "lucide-react";

export default function UnavailabilityError() {
  const { orderRequest, modal, setModal } = useOrderRequestStore();
  
  if (modal !== "error") return null;

  const isPlural = orderRequest.items.length > 1;
  const content = {
    title: isPlural ? "Items Unavailable" : "Item Unavailable",
    desc: isPlural 
      ? "Some items in your cart are no longer available. Please remove them to continue." 
      : "The item selected is no longer available. Please remove it to continue."
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 isolate animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" 
        onClick={() => setModal("cart")} 
      />

      {/* Alert Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Warning Icon */}
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-center text-lg font-black text-gray-900 mb-2">{content.title}</h2>
        <p className="text-center text-sm text-gray-500 font-medium mb-6 leading-relaxed">
          {content.desc}
        </p>

        {/* Action Button */}
        <button 
          onClick={() => setModal("cart")}
          className="w-full bg-gray-900 text-white py-3.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-900/20"
        >
          Got it
        </button>
      </div>
    </div>
  );
}