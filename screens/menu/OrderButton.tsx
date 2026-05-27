"use client";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderSummary } from "@/models/orderRequest/hooks";
import { useCreateOrder } from "@/models/order/hooks"; // Assuming this exists
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderButton() {
  const { orderRequest, setModal,setItems, setCustomerId, setCustomerName, setCustomerPhoneNumber, setCustomerTitle } = useOrderRequestStore();
  const { totalQuantity, totalPrice } = useOrderSummary();
  const { mutate, isPending } = useCreateOrder();
  const [customerId, setCustomer] = useState<null | number>(null)

  if (totalQuantity === 0) return null;

  useEffect(() => {
    setCustomer(Number(localStorage.getItem("id")))
    setCustomerId(Number(localStorage.getItem("id")))
    setCustomerName(String(localStorage.getItem("name")))
    setCustomerTitle(String(localStorage.getItem("title")))
    setCustomerPhoneNumber(String(localStorage.getItem("phone")))
  }, [])


  const handlePlaceOrder = () => {
    console.log(orderRequest)
    if (!customerId) {
      setModal("customer")
    }

    if (!orderRequest.items.filter(el => el.status == "ACTIVE" || el.status == "AVAILABLE")) {
      setModal("error")
    }

    mutate(orderRequest, {
      onSuccess: () => {
        setItems([])
        setModal("success")
      },
      onError: (err) => {
        console.error("Order failed", err);
      }
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white  border-t border-black z-50">
      <button
        onClick={handlePlaceOrder}
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2.5 rounded-lg font-bold flex justify-between items-center px-6 transition-all shadow-lg shadow-indigo-900/20"
      >
        <span className="flex items-center gap-2">
          {isPending ? "Processing..." : "Place Order"}
          {!isPending && <CheckCircle2 className="w-5 h-5" />}
        </span>

        <div className="flex flex-col items-end">
          <span className="text-lg">₦{totalPrice.toLocaleString()}</span>
        </div>
      </button>
    </div>
  );
}