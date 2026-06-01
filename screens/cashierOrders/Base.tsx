"use client"
import { OrderList } from "./OrderList";
import { useOrderRealtime } from "@/sockets/useOrderRealTime";

export default function Base() {
  useOrderRealtime()
  return (
    <OrderList />
  )
}
