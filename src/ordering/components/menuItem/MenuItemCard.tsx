"use client";
import { useState } from "react";
import { MenuItemResponseDTO } from "@/src/menuItems/types";
import { useOrderRequestStore } from "@/src/ordering/store.request";
import { Utensils, Plus, Trash2, X, ShoppingBag, Sparkles } from "lucide-react";

interface MenuItemCardProps {
  menuItem: MenuItemResponseDTO;
}

export  function MenuItemCard({ menuItem }: MenuItemCardProps) {
  const { addItem, removeItem, orderRequest } = useOrderRequestStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAvailable = menuItem.status === "AVAILABLE";
  const isInOrder = orderRequest.items.some((item) => item.menuItemId === menuItem.id);

  return (
    <>
      {/* Main Interactive Card */}
      <div
        onClick={() => isAvailable && setIsModalOpen(true)}
        className={`
          group relative flex items-center gap-4 bg-white rounded-2xl p-4 
          transition-all duration-200 border border-gray-100
          ${!isAvailable
            ? "opacity-60 bg-gray-50 cursor-not-allowed select-none"
            : "cursor-pointer hover:shadow-sm hover:border-gray-200"
          }
        `}
      >
        {/* Circular Image / Icon */}
        <div className="relative w-17.5 h-17.5 shrink-0 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
          {menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
            />
          ) : (
            <Utensils className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
            {menuItem.name}
          </h3>
          <div className="flex items-baseline mt-1.5">
            <span className="text-xs font-medium text-emerald-600 mr-0.5">₦</span>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              {menuItem.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons (unchanged styling) */}
        <div className="shrink-0 pl-1" onClick={(e) => e.stopPropagation()}>
          {!isAvailable ? (
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 rounded-lg uppercase tracking-wider">
              Unavailable
            </span>
          ) : isInOrder ? (
            <button
              onClick={() => removeItem(menuItem.id)}
              className="flex items-center justify-center h-10 w-10 shadow-md rounded-full border-2 border-red-500 bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
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
              className="flex items-center justify-center shadow-md h-10 w-10 rounded-full border-2 border-green-500 bg-green-50 text-green-600 hover:bg-green-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Premium Detail Modal (unchanged – keeps rectangular image) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 z-10 flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero image (rectangular) */}
            <div className="relative h-48 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              {menuItem.imageUrl ? (
                <img
                  src={menuItem.imageUrl}
                  alt={menuItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Utensils className="w-16 h-16 text-gray-300" />
              )}
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Chef's pick
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {menuItem.name}
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {menuItem.description || "A delicious dish prepared with fresh ingredients."}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </span>
                <div className="flex items-baseline">
                  <span className="text-sm font-semibold text-emerald-600 mr-0.5">₦</span>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    {menuItem.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {isInOrder ? (
                  <button
                    onClick={() => {
                      removeItem(menuItem.id);
                      setIsModalOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-[0.98]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from order
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addItem({
                        menuItemId: menuItem.id,
                        quantity: 1,
                        takeOut: false,
                        name: menuItem.name,
                        price: menuItem.price,
                        status: menuItem.status,
                      });
                      setIsModalOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}