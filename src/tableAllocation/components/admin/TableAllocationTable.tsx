"use client";
import { TableAllocationResponseDTO } from "@/src/tableAllocation/types";

interface TableAllocationTableProps {
  data: TableAllocationResponseDTO[];
  isLoading?: boolean;
  onRowClick?: (item: TableAllocationResponseDTO) => void;
}

export function TableAllocationTable({ data, isLoading, onRowClick }: TableAllocationTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">No allocations found</div>
    );
  }

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "—";

    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    if (isToday) return time;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day} ${time}`;
  };

  return (
    <div className="overflow-x-auto border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 rounded-3xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/60">
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">ID</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Cashier</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Cashier Allocated</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Cashier Deallocated</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Waiter</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Waiter Allocated</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">Waiter Deallocated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer hover:bg-gray-700/20 transition-colors" : ""}
            >
              <td className="px-3 py-2  text-[10px] text-gray-500">{item.id}</td>
              <td className="px-3 py-2 text-white text-[12px]">{item.cashier?.fullName ?? "—"}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{formatDate(item.cashierAllocatedAt)}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{formatDate(item.cashierDeallocatedAt)}</td>
              <td className="px-3 py-2 text-white text-[12px]">{item.waiter?.fullName ?? "—"}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{formatDate(item.waiterAllocatedAt)}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{formatDate(item.waiterDeallocatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}