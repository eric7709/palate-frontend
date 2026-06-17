// components/TableAllocationFilters.tsx
"use client";

import { useTableAllocationStore } from "@/src/tableAllocation/store";
import CustomSelect from "@/src/shared/components/CustomSelect";
import DateDropdown from "@/src/shared/components/DateDropdown";
import { useGetWaiterOptions, useGetCashierOptions } from "@/src/employees/hooks/hooks.api";
import { useGetAllTablesNoPagination } from "@/src/tables/hooks/hooks.api";
import { RotateCcw } from "lucide-react";

export function TableAllocationFilters({ showFilters }: { showFilters: boolean }) {
  const {
    tableId,
    waiterId,
    cashierId,
    active,
    date,
    page,
    size,
    setTableId,
    setWaiterId,
    setCashierId,
    setActive,
    setDate,
    setPage,
    setSize,
    resetFilters,
  } = useTableAllocationStore();

  const waiterOptions = useGetWaiterOptions();
  const cashierOptions = useGetCashierOptions();
  const tables = useGetAllTablesNoPagination();

  const tableOptions = [
    { value: "", label: "All tables" },
    ...tables.map((table) => ({
      value: String(table.id),
      label: `${table.tableName} (${table.tableNumber})`,
    })),
  ];

  const waiterSelectOptions = [{ value: "", label: "All waiters" }, ...waiterOptions];
  const cashierSelectOptions = [{ value: "", label: "All cashiers" }, ...cashierOptions];

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "true", label: "Active only" },
    { value: "false", label: "Inactive only" },
  ];

  const pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
  ];

  if (!showFilters) return null;

  return (
    <div className="border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 rounded-3xl overflow-visible">
      <div className="p-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
          {/* Table */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Table</label>
            <CustomSelect
              value={tableId ? String(tableId) : ""}
              onSelect={(val) => setTableId(val ? Number(val) : null)}
              options={tableOptions}
              placeholder="Select table"
              align="left"
              fullWidth
            />
          </div>

          {/* Waiter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Waiter</label>
            <CustomSelect
              value={waiterId ? String(waiterId) : ""}
              onSelect={(val) => setWaiterId(val ? Number(val) : null)}
              options={waiterSelectOptions}
              placeholder="Select waiter"
              align="left"
              fullWidth
            />
          </div>

          {/* Cashier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Cashier</label>
            <CustomSelect
              value={cashierId ? String(cashierId) : ""}
              onSelect={(val) => setCashierId(val ? Number(val) : null)}
              options={cashierSelectOptions}
              placeholder="Select cashier"
              align="left"
              fullWidth
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Status</label>
            <CustomSelect
              value={active === null ? "" : String(active)}
              onSelect={(val) => {
                if (val === "") setActive(null);
                else setActive(val === "true");
              }}
              options={statusOptions}
              placeholder="Status"
              align="left"
              fullWidth
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Date</label>
            <DateDropdown
              selected={date}
              onSelect={setDate}
              placeholder="Pick a date"
              align="left"
              fullWidth
            />
          </div>

          {/* Per page */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Per page</label>
            <CustomSelect
              value={String(size)}
              onSelect={(val) => setSize(Number(val))}
              options={pageSizeOptions}
              placeholder="Size"
              align="right"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className=" mx-5" />

      {/* Pagination */}
      <div className="px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs text-gray-400">
          Page <span className="text-white font-mono">{page + 1}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetFilters}
            className="p-1.5 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 text-gray-300 transition-colors border border-blue-500/30"
            title="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}