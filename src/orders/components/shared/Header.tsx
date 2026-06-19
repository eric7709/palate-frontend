"use client";
import { History, ShoppingCart } from "lucide-react";
import { useOrderSummary } from "@/src/orders/hooks/hooks.api.request";
import { useOrderCustomerStore } from "@/src/customers/store";
import Logo from "@/src/shared/components/utils/Logo";
import { useEffect } from "react";
import { useGetCustomerOrdersToday } from "../../hooks/hooks.api";
import { useOrderRequestStore } from "../../store/index.request";

export  function Header() {
  const { totalQuantity } = useOrderSummary();
  const { setModal } = useOrderRequestStore();
  const { customer, hydrateFromStorage } = useOrderCustomerStore();
  const { data } = useGetCustomerOrdersToday(
    customer ? Number(customer.id) : 0
  );
  const onClickCart = () => setModal("CART");
  const onClickHistory = () => setModal("HISTORY");
  const activeOrdersCount = (data || []).filter((order) => order.orderStatus !== "PAID" && order.orderStatus !== "CANCELLED").length;

  useEffect(() => { hydrateFromStorage() }, [])


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 h-14 w-full">
      <div className="w-full mx-auto h-full flex gap-2 items-center">
        <Logo />
        <button onClick={onClickHistory} className="relative p-2 hover:bg-gray-100 ml-auto rounded-full transition-all">
          <History className="w-5 h-5 text-gray-600" />
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {activeOrdersCount}
            </span>
          )}
        </button>
        <button onClick={onClickCart} className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
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