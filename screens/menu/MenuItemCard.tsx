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
    <div
      className={`flex items-center gap-3 bg-white rounded-2xl border p-3 transition-all ${
        !isAvailable
          ? "opacity-60 border-gray-100 bg-gray-50/30"
          : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Image circle */}
      <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
        {menuItem.imageUrl ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Utensils className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {menuItem.name}
        </h3>
        <p className="text-blue-600 font-bold text-sm mt-0.5">
          ₦{menuItem.price.toLocaleString()}
        </p>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {!isAvailable ? (
          <span className="inline-block px-3 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 rounded-full uppercase tracking-wider">
            Sold out
          </span>
        ) : isInOrder ? (
          <button
            onClick={() => removeItem(menuItem.id)}
            className="px-4 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors uppercase tracking-wide"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() =>
              addItem({
                menuItemId: menuItem.id,
                quantity: 1,
                takeOut: false,
                name: menuItem.name,
                price: menuItem.price,
                status: menuItem.status,
              })
            }
            className="px-4 py-1.5 text-[11px] font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-sm uppercase tracking-wide"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}