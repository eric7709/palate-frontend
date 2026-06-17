"use client";
import { MenuItemResponseDTO } from "@/src/menuItems/types";
import { useUpdateMenuItem } from "@/src/menuItems/hooks/hooks.api";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  menuItem: MenuItemResponseDTO;
};

export function MenuItemCard({ menuItem }: Props) {
  const { mutate, isPending } = useUpdateMenuItem();
  const isAvailable = menuItem.status === "AVAILABLE";

  return (
    <div
      className={`relative p-3 rounded-xl border transition-all flex items-center gap-3 ${isAvailable
          ? "bg-white border-gray-200 shadow-sm"
          : "bg-gray-50 border-gray-200 opacity-75"
        }`}
    >
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 rounded-xl backdrop-blur-[1px]">
          <div className="h-6 w-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Circular Image */}
      <div className="shrink-0">
        {menuItem.imageUrl ? (
          <Image
            src={menuItem.imageUrl}
            alt={menuItem.name}
            width={48}  // Matches w-12 (12 * 4 = 48px)
            height={48} // Matches h-12 (12 * 4 = 48px)
            className="rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{menuItem.name}</p>
        <p className="text-xs text-gray-500 truncate">{menuItem.categoryName || "Uncategorized"}</p>
        {!isAvailable && (
          <p className="text-red-600 text-[10px] mt-0.5">Unavailable</p>
        )}
      </div>

      {/* Price + Toggle Switch */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="text-sm font-bold text-gray-900">₦{menuItem.price?.toLocaleString()}</p>

        <button
          disabled={isPending}
          onClick={() => {
            mutate({
              id: menuItem.id,
              payload: { status: isAvailable ? "UNAVAILABLE" : "AVAILABLE" },
            });
          }}
          className={`
            relative inline-flex h-5 w-9 items-center rounded-full transition-colors
            ${isPending ? "cursor-wait" : "cursor-pointer"}
            ${isAvailable ? "bg-green-500" : "bg-red-500"}
          `}
          role="switch"
          aria-checked={isAvailable}
        >
          <span
            className={`
              inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
              ${isAvailable ? "translate-x-5" : "translate-x-0.5"}
            `}
          />
        </button>
      </div>
    </div>
  );
}