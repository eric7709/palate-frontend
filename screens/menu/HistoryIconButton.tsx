// HistoryIconButton.tsx
// Example: wherever you render your history icon in the nav/toolbar,
// this badge now reads from the store and is correct before the drawer opens.

"use client";
import { History } from "lucide-react";
import { useOrderRequestStore } from "@/models/orderRequest/store";
import { useOrderHistoryStore } from "@/models/customer/store.history";

export default function HistoryIconButton() {
  const { setModal } = useOrderRequestStore();
  const activeCount = useOrderHistoryStore((s) =>
    s.orders.filter(
      (o) => o.orderStatus !== "PAID" && o.orderStatus !== "CANCELLED"
    ).length
  );

  return (
    <button
      onClick={() => setModal("history")}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Order history"
    >
      <History className="w-5 h-5 text-gray-600" />
      {activeCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[1rem] h-4 px-0.5 flex items-center justify-center rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// In your root layout or a top-level provider component, add:
//
//   import { useOrderSync } from "@/hooks/useOrderSync";
//   import { useOrderRealtime } from "@/hooks/useOrderRealtime";
//
//   function AppProviders({ children }) {
//     const [customerId, setCustomerId] = useState<number | null>(null);
//
//     useEffect(() => {
//       const id = localStorage.getItem("id");
//       if (id) setCustomerId(Number(id));
//     }, []);
//
//     useOrderSync();                        // eager fetch → populates store
//     useOrderRealtime({ customerId });      // WebSocket → invalidates same query
//
//     return <>{children}</>;
//   }
//
// ─────────────────────────────────────────────────────────────────
// IMPORTANT: check what query key useGetCustomerOrdersToday uses internally.
// It must match what useOrderRealtime invalidates. For example if your hook is:
//
//   export function useGetCustomerOrdersToday(customerId?: number) {
//     return useQuery({
//       queryKey: ["customerOrdersToday", customerId],   // ← this key
//       queryFn: () => fetchOrdersToday(customerId),
//       enabled: !!customerId,
//     });
//   }
//
// Then in useOrderRealtime, invalidate:
//   queryClient.invalidateQueries({ queryKey: ["customerOrdersToday", customerId] });
// ─────────────────────────────────────────────────────────────────