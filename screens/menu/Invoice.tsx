"use client";
import { OrderResponseDTO } from "@/models/order/types";
import { ChefHat } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
  order: OrderResponseDTO;
  currentDateTime: string;
};
const Invoice = forwardRef<HTMLDivElement, Props>(({ order, currentDateTime }, ref) => {

  const formatPrice = (amount: number): string => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div ref={ref} className="w-full">
      <div
        style={{
          width: "80mm",
          padding: "20px",
          marginTop: "50px",
          fontFamily: "monospace",
        }}
        className="mx-auto text-gray-800 text-sm bg-white"
      >
        {/* Header */}
        <div className="text-center flex flex-col items-center justify-center border-b border-dashed border-gray-400 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <ChefHat className={`w-4 h-4 text-black `} />
            <h1 className="text-base font-bold">Palate</h1>
          </div>

          <p className="text-xs">123 Main Street, City</p>
          <p className="text-[10px] text-gray-500">
            Receipt #{order.invoiceNumber}
          </p>
          <p className="text-[10px] text-gray-500">{currentDateTime}</p>
        </div>

        {/* Details */}
        <div className="mb-2 text-[13px] space-y-1">
          <p>
            <span className="font-semibold">Table:</span> #{order?.table?.tableNumber}
          </p>
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {order.customer?.name}
          </p>
          <p>
            <span className="font-semibold">Waiter:</span>{" "}
            {order.waiter?.fullName?.split(" ")[0] || "Unassigned"}
          </p>
        </div>

        {/* Items */}
        <div className="border-t border-b border-dashed border-gray-200 py-2 mb-2">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-xs mb-1 text-gray-700"
            >
              <span>
                {item.quantity} × {item.menuItemName}
              </span>
              <span>{formatPrice(item.quantity * item.price)}</span>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="text-right text-sm font-semibold">
          Total: {formatPrice(order.total)}
        </div>
        {/* Footer */}
        <p className="text-center text-[10px] mt-2">
          ⭐ Thanks for dining with us! ⭐
        </p>
      </div>
    </div>
  );
});

Invoice.displayName = 'Invoice';

export default Invoice;