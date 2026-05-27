import { OrderProvider } from "@/provider/OrderProvider";
import { OrderList } from "./OrderList";

export default function Base() {
  return (
    <div>
      <OrderProvider subscribeGlobal={true}>
        <OrderList />
      </OrderProvider>
    </div>
  )
}
