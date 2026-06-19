"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useOrderRequestStore } from "../../store/index.request";
import { OrderItemDTO } from "../../types";

interface CartItemProps {
  item: OrderItemDTO;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, toggleTakeOut, unavailableItems } = useOrderRequestStore();
  
  const isStatusAvailable = item.status === "AVAILABLE" || item.status === "ACTIVE";
  const isUnavailable = unavailableItems?.includes(item.menuItemId);
  const isAvailable = isStatusAvailable && !isUnavailable;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-full border transition-all ${
      isAvailable ? "bg-white border-gray-100 shadow-sm" : "bg-red-50/50 border-red-200 opacity-70"
    }`}>
      {/* 1. Item Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-bold truncate ${isAvailable ? "text-gray-800" : "text-red-500"}`}>
          {item.name}
        </h3>
        <p className={`font-bold text-xs ${isAvailable ? "text-emerald-600" : "text-red-400"}`}>
          {isUnavailable ? "No longer available" : `₦${item.price.toLocaleString()}`}
        </p>
      </div>

      {/* 2. Compact Actions */}
      <div className="flex items-center gap-3">

        {/* Toggle Pill */}
        <button
          onClick={() => toggleTakeOut(item.menuItemId)}
          disabled={!isAvailable}
          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${
            item.takeOut ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          } disabled:opacity-40`}
        >
          {item.takeOut ? "Take out" : "Dine in"}
        </button>

        {/* Mini Stepper */}
        <div className="flex items-center bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => updateQuantity(item.menuItemId, -1)}
            disabled={!isAvailable || item.quantity <= 1}
            className="p-1.5 hover:bg-white rounded-full disabled:opacity-30 transition-all"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.menuItemId, 1)}
            disabled={!isAvailable}
            className="p-1.5 hover:bg-white rounded-full disabled:opacity-30 transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() => removeItem(item.menuItemId)}
          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}