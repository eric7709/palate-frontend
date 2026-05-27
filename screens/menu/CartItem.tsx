"use client";
import { OrderItemDTO } from "@/models/order/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: OrderItemDTO;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, toggleTakeOut } = useOrderRequestStore();
const isAvailable = item.status == "AVAILABLE" || item.status == "ACTIVE"
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
      {!isAvailable && <p>Unavailable</p>}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs font-semibold text-emerald-600">
              ₦{item.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400">each</span>
          </div>
        </div>
        <button
          onClick={() => removeItem(item.menuItemId)}
          className="shrink-0 w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 2: dine‑in/take‑out toggle + rounded quantity controls */}
      <div className="flex items-center justify-between mt-2">
        {/* Dine‑in / Take‑out toggle */}
        <button
          onClick={() => toggleTakeOut(item.menuItemId)}
          className={`
            text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors
            ${item.takeOut 
              ? "bg-amber-50 text-amber-600 border border-amber-200" 
              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }
          `}
        >
          {item.takeOut ? "TAKE OUT" : "DINE IN"}
        </button>

        {/* Rounded quantity controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => updateQuantity(item.menuItemId, -1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="min-w-[24px] text-center text-xs font-medium text-gray-800">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.menuItemId, 1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}