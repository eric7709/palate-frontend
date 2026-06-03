"use client";
import { History, ShoppingCart } from "lucide-react";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import Logo from "@/ui/Logo";
import { useGetCustomerOrdersToday } from "@/models/order/hooks";

export default function Header() {
  const { totalQuantity } = useOrderSummary();
  const { setModal } = useOrderRequestStore();

  const customerId = typeof window !== "undefined"
    ? Number(localStorage.getItem("id")) || undefined
    : undefined;

  const { data } = useGetCustomerOrdersToday(customerId);

  const onClickCart = () => setModal("cart");
  const onClickHistory = () => setModal("history");

  const activeOrdersCount = (data || []).filter(
    (order) => order.orderStatus !== "PAID" && order.orderStatus !== "CANCELLED"
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 h-14 w-full">
      <div className="max-w-7xl mx-auto h-full flex gap-2 items-center">
        <Logo />

        <button
          onClick={onClickHistory}
          className="relative p-2 hover:bg-gray-100 gap-2 ml-auto rounded-full transition-all"
        >
          <History className="w-5 h-5 text-gray-600" />
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {activeOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={onClickCart}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-gray-600" />
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