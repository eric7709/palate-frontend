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
            <ChefHat className="w-4 h-4 text-black" />
            <h1 className="text-base font-bold">Palate</h1>
          </div>
          <p className="text-xs">123 Main Street, City</p>
          <p className="text-[10px] text-gray-500">Receipt #{order.invoiceNumber}</p>
          <p className="text-[10px] text-gray-500">{currentDateTime}</p>
        </div>

        {/* Details */}
        <div className="mb-2 text-[13px] space-y-1">
          <p>
            <span className="font-semibold">Table:</span> #{order?.table?.tableNumber}
          </p>
          <p>
            <span className="font-semibold">Customer:</span> {order.customer?.name}
          </p>
          <p>
            <span className="font-semibold">Waiter:</span>{" "}
            {order.waiter?.fullName?.split(" ")[0] || "Unassigned"}
          </p>
        </div>

        {/* Items */}
        <div className="border-t border-b border-dashed border-gray-200 py-2 mb-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs mb-1 text-gray-700">
              <span>{item.quantity} × {item.menuItemName}</span>
              <span>{formatPrice(item.quantity * item.price)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-right text-sm font-semibold mb-3">
          Total: {formatPrice(order.total)}
        </div>

        {/* Payment Details — only show if virtual account exists */}
        {order.virtualAccountNumber && order.virtualBankName && (
          <div className="border border-dashed border-gray-300 rounded p-2 mb-3 text-[11px] space-y-1">
            <p className="text-center font-bold text-xs mb-1 uppercase tracking-wide">
              Pay via Bank Transfer
            </p>
            <div className="flex justify-between">
              <span className="text-gray-500">Bank</span>
              <span className="font-semibold">{order.virtualBankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account No</span>
              <span className="font-semibold tracking-widest">{order.virtualAccountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name</span>
              <span className="font-semibold">
                {order.customer?.title} {order.customer?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-black">{formatPrice(order.total)}</span>
            </div>
            <p className="text-center text-[9px] text-gray-400 mt-1">
              Transfer exact amount · Account expires in 24hrs
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] mt-2">⭐ Thanks for dining with us! ⭐</p>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";

export default Invoice;