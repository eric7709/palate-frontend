"use client";

import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useCreateOrder } from "@/models/order/hooks";
import { useGetUnavailableMenuItems } from "@/models/menuItem/hooks";
import { Loader2, ShoppingBag } from "lucide-react";

export default function ConfirmModal() {
  const { orderRequest, setModal, setItems, setUnavailableItems, modal, setCustomerId, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: checkUnavailableItems, isPending: isChecking } = useGetUnavailableMenuItems();

  if (modal !== "confirm") return null;


  const handleConfirm = async () => {
    setCustomerPhoneNumber(String(localStorage.getItem("phone")))
    setCustomerName(String(localStorage.getItem("name")))
    setCustomerTitle(String(localStorage.getItem("title")))
    if (!orderRequest.customerId) { setModal("customer"); return; }
    const hasActiveItems = orderRequest.items.some(
      el => el.status === "ACTIVE" || el.status === "AVAILABLE"
    );
    if (!hasActiveItems) { setModal("error"); return; }

    try {
      const unavailableIds = await checkUnavailableItems(orderRequest.items.map(el => el.menuItemId));
      setUnavailableItems(unavailableIds);
      if (unavailableIds.length > 0) { setModal("error"); return; }

      createOrder(orderRequest, {
        onSuccess: () => { setItems([]); setModal("success"); },
        onError: (err) => console.error("Order failed", err),
      });
    } catch (err) {
      console.error("Availability check failed", err);
      setModal("error");
    }
  };

  const isLoading = isCreating || isChecking;

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16181d] border border-white/8 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Confirm Order</h3>
            <p className="text-[11px] text-gray-500">{totalQuantity} item{totalQuantity > 1 ? "s" : ""} · ₦{totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="mx-4 mb-3 bg-white/4 rounded-2xl max-h-44 overflow-y-auto divide-y divide-white/5">
          {orderRequest.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-white/8 text-gray-400 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
                <span className="text-xs text-gray-200 font-medium">{item.name}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 px-4 pb-5">
          <button
            onClick={() => setModal("cart")}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-white/6 hover:bg-white/10 text-white text-sm font-semibold transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              : "Place Order"
            }
          </button>
        </div>

      </div>
    </div>
  );
}