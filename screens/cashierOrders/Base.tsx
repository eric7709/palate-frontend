"use client"
import { OrderList } from "./OrderList";
import { useOrderRealtime } from "@/models/order/useOrderRealTime";

export default function Base() {
  useOrderRealtime()
  return (
    <OrderList />
  )
}
