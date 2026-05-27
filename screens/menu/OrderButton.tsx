"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useCreateOrder } from "@/models/order/hooks";
import { Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUnavailableMenuItems } from "@/models/menuItem/hooks";

export default function OrderButton() {
  const { orderRequest, setModal, setItems, setCustomerId, setUnavailableItems, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const { mutate, isPending } = useCreateOrder();
  const [isClient, setIsClient] = useState(false);
  const { mutateAsync: checkUnavailableItems, isPending: isChecking } = useGetUnavailableMenuItems();

  useEffect(() => {
    setIsClient(true);
    setCustomerId(Number(localStorage.getItem("id")));
    setCustomerName(localStorage.getItem("name") || "");
    setCustomerTitle(localStorage.getItem("title") || "");
    setCustomerPhoneNumber(localStorage.getItem("phone") || "");
  }, [setCustomerId, setCustomerName, setCustomerTitle, setCustomerPhoneNumber]);

  if (!isClient || totalQuantity === 0) return null;

  const handlePlaceOrder = async () => {
    const hasActiveItems = orderRequest.items.some(el => el.status === "ACTIVE" || el.status === "AVAILABLE");
    if (!orderRequest.customerId) { setModal("customer"); return; }
    if (!hasActiveItems) { setModal("error"); return; }

    const ids = orderRequest.items.map(el => el.menuItemId);
    
    try {
      const unavailableIds = await checkUnavailableItems(ids);
      setUnavailableItems(unavailableIds);
      console.log(unavailableIds, "IDS")

      if (unavailableIds.length > 0) {
        setModal("error"); // show which items are no longer available
        return;
      }

      mutate(orderRequest, {
        onSuccess: () => { setItems([]); setModal("success"); },
        onError: (err) => console.error("Order failed", err),
      });
    } catch (err) {
      console.error("Availability check failed", err);
    }
  };

  const isLoading = isPending || isChecking;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading}
        className="w-full bg-gray-900 text-white py-3 px-5 rounded-full font-bold flex items-center justify-between shadow-lg active:scale-[0.98] transition-all"
      >
        <span className="text-xs opacity-75">{totalQuantity} items</span>
        <span className="flex items-center gap-2">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Checkout"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-extrabold">
          ₦{totalPrice.toLocaleString()}
        </span>
      </button>
    </div>
  );
}