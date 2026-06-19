"use client"
import { useOrderRequestStore } from "../../store/index.request";
import { CartItem } from "./CartItem";

export function CartList() {
  const { orderRequest } = useOrderRequestStore();

  return (
    <div className="space-y-2 pb-1 flex-1 overflow-y-auto">
      {orderRequest.items.map((item) => (
        <CartItem 
          key={item.menuItemId} 
          item={item} 
        />
      ))}
    </div>
  );
}