"use client";
import { MenuItemResponseDTO } from "@/models/menuItem/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { Utensils } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItemResponseDTO;
}

export default function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem, removeItem, orderRequest } = useOrderRequestStore();

  const isAvailable = menuItem.status === "AVAILABLE";
  const isInOrder = orderRequest.items.some((item) => item.menuItemId === menuItem.id);
  

  return (
    <div className={`flex items-center gap-3 bg-white p-2.5 rounded-full border transition-all ${
      !isAvailable ? "opacity-50 border-gray-100 grayscale" : "border-gray-100 shadow-sm"
    }`}>
      
      {/* Circular Image */}
      <div className="w-12 h-12 shrink-0 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
        {menuItem.imageUrl ? (
          <img src={menuItem.imageUrl} alt={menuItem.name} className="w-full h-full object-cover" />
        ) : (
          <Utensils className="w-5 h-5 text-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-sm font-extrabold text-gray-900 truncate">{menuItem.name}</h3>
        <p className="text-emerald-600 font-bold text-xs">₦{menuItem.price.toLocaleString()}</p>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0">
        {!isAvailable ? (
          <div className="px-4 py-2 text-[10px] font-black text-gray-400 bg-gray-100 rounded-full uppercase tracking-wider">
            Sold Out
          </div>
        ) : isInOrder ? (
          <button
            onClick={() => removeItem(menuItem.id)}
            className="px-5 py-2 text-[11px] font-black text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors uppercase tracking-wider"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => addItem({
              menuItemId: menuItem.id,
              quantity: 1,
              takeOut: false,
              name: menuItem.name,
              price: menuItem.price,
              status: menuItem.status
            })}
            className="px-5 py-2 text-[11px] font-black text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 uppercase tracking-wider"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}