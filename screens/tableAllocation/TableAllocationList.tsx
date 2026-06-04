// components/TableAllocationList.tsx
"use client";

import { useTableAllocationStore } from "@/models/tableAllocation/store";
import { useGetAllAllocations } from "@/models/tableAllocation/hooks";
import { TableAllocationResponseDTO } from "@/models/tableAllocation/types";
import { TableAllocationTable } from "./TableAllocationTable";

export function TableAllocationList() {
  const {
    tableId,
    active,
    date,
    page,
    size,
    sortBy,
    sortDirection,
    getStaffParams,
  } = useTableAllocationStore();

  const { staffId, role } = getStaffParams();

  const filters = {
    tableId,
    staffId,
    role,
    active,
    date,
    page,
    size,
    sortBy,
    sortDirection,
  };

  const { data, isLoading, isError, error } = useGetAllAllocations(filters);

  if (isError) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-sm text-rose-400">
        Failed to load allocations: {(error as Error)?.message || "Unknown error"}
      </div>
    );
  }

  const allocations = data?.content ?? [];

  return <TableAllocationTable data={allocations} isLoading={isLoading} />;
}