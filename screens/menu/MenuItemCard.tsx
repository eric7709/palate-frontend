"use client";
import { MenuItemResponseDTO } from "@/models/menuItem/types";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { Plus, Minus, Utensils } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItemResponseDTO;
}

export default function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem, removeItem, orderRequest } = useOrderRequestStore();

  const isAvailable = menuItem.status === "AVAILABLE";
  const isInOrder = orderRequest.items.some(
    (item) => item.menuItemId === menuItem.id
  );

  return (
    <div
      className={`
        flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3
        shadow-sm hover:shadow-md transition-all
        ${!isAvailable && "opacity-60 bg-gray-50"}
      `}
    >
      {/* Circular image / placeholder */}
      <div className="shrink-0">
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 shadow-inner">
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Utensils className="w-6 h-6" />
          )}
        </div>
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {menuItem.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xs font-mono font-bold text-emerald-600">
            ₦{menuItem.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">
            {menuItem.categoryName}
          </span>
        </div>
        {!isAvailable && (
          <span className="inline-block mt-1 text-[9px] font-medium text-gray-400 uppercase">
            Sold out
          </span>
        )}
      </div>

      {/* Add/Remove button */}
      <div className="shrink-0">
        {!isAvailable ? (
          <div className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg">
            Unavailable
          </div>
        ) : isInOrder ? (
          <button
            onClick={() => removeItem(menuItem.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Remove</span>
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
                status: menuItem.status
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
}