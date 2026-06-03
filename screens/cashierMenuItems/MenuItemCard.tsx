"use client";
import { MenuItemResponseDTO } from "@/models/menuItem/types";
import { useUpdateMenuItem } from "@/models/menuItem/hooks";

type Props = {
  menuItem: MenuItemResponseDTO;
};

export default function MenuItemCard({ menuItem }: Props) {
  const { mutate, isPending } = useUpdateMenuItem();
  const isAvailable = menuItem.status === "AVAILABLE";

  return (
    // The 'relative' class here keeps the spinner confined to this card
    <div className={`relative text-white p-4 rounded-xl border-2 transition-all ${
      isAvailable ? "bg-gray-800 border-gray-700" : "opacity-60 bg-gray-900 border-gray-800"
    }`}>
      
      {/* Centered Overlay Spinner */}
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1a1c21]/80 rounded-xl backdrop-blur-[2px]">
          <div className="h-6 w-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      <div className="flex justify-between items-center gap-2">
        <div>
          <p className="text-base font-semibold">{menuItem.name}</p>
          <p className="text-xs text-gray-400">{menuItem.categoryName}</p>
        </div>
        
        <button
          disabled={isPending}
          onClick={() => {
            mutate({
              id: menuItem.id, 
              payload: { status: isAvailable ? "UNAVAILABLE" : "AVAILABLE" }
            });
          }}
          className={`
            relative inline-flex h-5 w-9 items-center rounded-full transition-colors 
            ${isPending ? "cursor-wait" : "cursor-pointer"}
            ${isAvailable ? "bg-green-600" : "bg-red-600"}
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
      
      <div className="h-4 mt-1">
        {!isAvailable && (
          <p className="text-red-400 text-xs">Currently unavailable</p>
        )}
      </div>
    </div>
  );
}