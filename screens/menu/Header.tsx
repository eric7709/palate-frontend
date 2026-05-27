"use client";
import { ShoppingCart } from "lucide-react";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import Logo from "@/ui/Logo";

export default function Header() {
  const { setModal } = useOrderRequestStore();
  const { totalQuantity } = useOrderSummary();

  const onClickCart = () => {
    setModal("cart");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 h-14 w-full">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Logo />
        <button
          onClick={onClickCart}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          {/* Cart Badge - only show if items exist */}
          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}