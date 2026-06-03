"use client";

import { useState } from "react";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useCreateOrder } from "@/models/order/hooks";
import { useGetUnavailableMenuItems } from "@/models/menuItem/hooks";
import { Loader2, ShoppingBag, AlertCircle, House } from "lucide-react";
import { toast } from "sonner";

export default function ConfirmModal() {
  const {
    orderRequest,
    setModal,
    setItems,
    setUnavailableItems,
    modal,
    setCustomerId,
    setCustomerName,
    setCustomerPhoneNumber,
    setCustomerTitle,
  } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: checkUnavailableItems, isPending: isChecking } =
    useGetUnavailableMenuItems();

  const [error, setError] = useState<string | null>(null);

  if (modal !== "confirm") return null;

  const handleConfirm = async () => {
    setError(null);

    // Load customer data from localStorage
    setCustomerPhoneNumber(String(localStorage.getItem("phone")));
    setCustomerName(String(localStorage.getItem("name")));
    setCustomerTitle(String(localStorage.getItem("title")));

    // Validate customer ID
    if (!orderRequest.customerId) {
      setModal("customer");
      return;
    }

    // Check if there are any active/available items
    const hasActiveItems = orderRequest.items.some(
      (el) => el.status === "ACTIVE" || el.status === "AVAILABLE"
    );
    if (!hasActiveItems) {
      setModal("error");
      toast.error("No active items in your cart", {
        description: "Please add available items before placing an order.",
      });
      return;
    }

    try {
      // Check for unavailable items (network call)
      const unavailableIds = await checkUnavailableItems(
        orderRequest.items.map((el) => el.menuItemId)
      );
      setUnavailableItems(unavailableIds);

      if (unavailableIds.length > 0) {
        setModal("error");
        toast.error("Some items are no longer available", {
          description: `Please remove ${unavailableIds.length} unavailable item(s) and try again.`,
        });
        return;
      }

      // Place the order (network call)
      createOrder(orderRequest, {
        onSuccess: (data) => {
          setItems([]);
          setModal("success");
          console.log(data)
          toast.success("Order placed successfully!", {
            description: `Your order #${data.invoiceNumber} has been received.`,
          });
        },
        onError: (err: any) => {
          console.error("Order creation failed", err);
          const errorMessage =
            err?.response?.data?.message || err?.message || "Failed to place order";
          toast.error("Order failed", {
            description: errorMessage,
          });
          setError(errorMessage);
        },
      });
    } catch (err: any) {
      console.error("Availability check failed", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Network error. Please check your connection and try again.";
      toast.error("Cannot verify items", {
        description: errorMessage,
      });
      setError(errorMessage);
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
            <p className="text-[11px] text-gray-500">
              {totalQuantity} item{totalQuantity > 1 ? "s" : ""} · ₦
              {totalPrice.toLocaleString()}
            </p>
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
                {item.takeOut && <House size={15} className="text-blue-500"/>}
              </div>
              <span className="text-xs text-gray-400 font-medium">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Error message (if any) */}
        {error && (
          <div className="mx-4 mb-3 p-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-[11px] text-red-300">{error}</span>
          </div>
        )}

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
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}