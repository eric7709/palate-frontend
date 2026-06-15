"use client";

import { useState } from "react";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useCreateOrder } from "@/models/order/hooks";
import { useGetUnavailableMenuItems } from "@/models/menuItem/hooks";
import { Loader2, ShoppingBag, AlertCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useOrderCustomerStore } from "@/models/customer/store";
import { getOrderRequestPayload } from "@/models/order/utils";

export default function ConfirmModal() {
  const modal = useOrderRequestStore((state) => state.modal);
  const orderItems = useOrderRequestStore((state) => state.orderRequest.items);
  const orderRequest = useOrderRequestStore((state) => state.orderRequest);

  const setModal = useOrderRequestStore((state) => state.setModal);
  const setItems = useOrderRequestStore((state) => state.setItems);
  const setUnavailableItems = useOrderRequestStore((state) => state.setUnavailableItems);

  const customer = useOrderCustomerStore((state) => state.customer);

  const { totalQuantity, totalPrice } = useOrderSummary();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: checkUnavailableItems, isPending: isChecking } = useGetUnavailableMenuItems();

  const [error, setError] = useState<string | null>(null);

  if (modal !== "confirm") return null;

  const handleConfirm = async () => {
    setError(null);

    if (!customer?.id) {
      setModal("customer");
      return;
    }

    const hasActiveItems = orderItems.some((el) => el.status === "AVAILABLE");

    if (!hasActiveItems) {
      setModal("error");
      toast.error("No active items in your cart", {
        description: "Please add available items before placing an order.",
      });
      return;
    }

    try {
      const unavailableIds = await checkUnavailableItems(orderItems.map((el) => el.menuItemId));
      setUnavailableItems(unavailableIds);

      if (unavailableIds.length > 0) {
        setModal("error");
        toast.error("Some items are no longer available", {
          description: `Please remove ${unavailableIds.length} unavailable item(s) and try again.`,
        });
        return;
      }

      const payload = getOrderRequestPayload(orderRequest, customer);
      createOrder(payload, {
        onSuccess: () => {
          setItems([]);
          setModal("success");
          toast.success("Order placed successfully!");
        },
        onError: (err: any) => {
          console.error("Order creation failed", err);
          const errorMessage = err?.response?.data?.message || err?.message || "Failed to place order";
          toast.error("Order failed", { description: errorMessage });
          setError(errorMessage);
        },
      });
    } catch (err: any) {
      console.error("Availability check failed", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Network error. Please check your connection.";
      toast.error("Cannot verify items", { description: errorMessage });
      setError(errorMessage);
    }
  };

  const isLoading = isCreating || isChecking;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-2xl">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Confirm Order</h3>
            <p className="text-[11px] text-gray-700 font-semibold">
              {totalQuantity} item{totalQuantity > 1 ? "s" : ""} · ₦{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mx-4 mb-3 bg-gray-50 border border-gray-100 rounded-xl max-h-44 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
          {orderItems.map((item, idx) => {
            const itemPrice = item.price ?? 0;
            return (
              <div key={item.menuItemId || idx} className="flex justify-between items-center px-3.5 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-bold w-5 h-5 rounded-lg flex items-center justify-center shrink-0">
                    {item.quantity}
                  </span>
                  <span className="text-xs text-gray-700 font-medium truncate">{item.name}</span>
                  {item.takeOut && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-100 text-[9px] font-bold text-blue-700 uppercase tracking-wider shrink-0">
                      <ShoppingCart size={10} /> Pack
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 font-semibold pl-2 shrink-0">
                  ₦{(itemPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Panel */}
        {error && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-red-700 leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 px-4 pb-5">
          <button
            type="button"
            onClick={() => setModal("cart")}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition active:scale-98 disabled:opacity-40 disabled:pointer-events-none"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Place Order</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}