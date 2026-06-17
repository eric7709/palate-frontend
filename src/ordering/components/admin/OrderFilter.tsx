"use client";

import CustomSelect from "@/src/shared/components/CustomSelect";
import DateDropdown from "@/src/shared/components/DateDropdown";
import { useGetWaiterOptions, useGetCashierOptions } from "@/src/employees/hooks/hooks.api";
import { useGetAllTablesNoPagination } from "@/src/tables/hooks/hooks.api";
import { RotateCcw, Search } from "lucide-react";
import { useOrderStore } from "../../store";
import { OrderStatus } from "../../types";

export function OrderFilters({ showFilters }: { showFilters: boolean }) {
  const {
    search,
    status,
    waiterId,
    cashierId,
    tableId,
    minTotal,
    maxTotal,
    startDate,
    endDate,
    page,
    size,
    setSearch,
    setStatus,
    setWaiterId,
    setCashierId,
    setTableId,
    setMinTotal,
    setMaxTotal,
    setStartDate,
    setEndDate,
    setPage,
    setSize,
    resetFilters,
  } = useOrderStore();

  const waiterOptions = useGetWaiterOptions();
  const cashierOptions = useGetCashierOptions();
  const tables = useGetAllTablesNoPagination();

  const waiterSelectOptions = [{ value: "", label: "All waiters" }, ...waiterOptions];
  const cashierSelectOptions = [{ value: "", label: "All cashiers" }, ...cashierOptions];

  const tableOptions = [
    { value: "", label: "All tables" },
    ...tables.map((table) => ({
      value: String(table.id),
      label: `${table.tableName} (${table.tableNumber})`,
    })),
  ];

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PREPARING", label: "Preparing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PAID", label: "Paid" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "30", label: "30" },
    { value: "50", label: "50" },
  ];

  if (!showFilters) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="p-4 pb-0 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Invoice #, customer..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <CustomSelect
              value={status || ""}
              onSelect={(val) => setStatus(val as OrderStatus | null)}
              options={statusOptions}
              placeholder="Status"
              align="left"
              fullWidth
            />
          </div>

          {/* Waiter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Waiter</label>
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
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Cashier</label>
            <CustomSelect
              value={cashierId ? String(cashierId) : ""}
              onSelect={(val) => setCashierId(val ? Number(val) : null)}
              options={cashierSelectOptions}
              placeholder="Select cashier"
              align="left"
              fullWidth
            />
          </div>

          {/* Table */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Table</label>
            <CustomSelect
              value={tableId ? String(tableId) : ""}
              onSelect={(val) => setTableId(val ? Number(val) : null)}
              options={tableOptions}
              placeholder="Select table"
              align="left"
              fullWidth
            />
          </div>

          {/* Min Total */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Min Total (₦)</label>
            <input
              type="number"
              value={minTotal ?? ""}
              onChange={(e) => setMinTotal(e.target.value ? Number(e.target.value) : null)}
              placeholder="0"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Max Total */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Max Total (₦)</label>
            <input
              type="number"
              value={maxTotal ?? ""}
              onChange={(e) => setMaxTotal(e.target.value ? Number(e.target.value) : null)}
              placeholder="∞"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Start Date</label>
            <DateDropdown selected={startDate} onSelect={setStartDate} placeholder="Start date" align="left" fullWidth />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">End Date</label>
            <DateDropdown selected={endDate} onSelect={setEndDate} placeholder="End date" align="left" fullWidth />
          </div>

          {/* Per Page */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Per page</label>
            <CustomSelect
              value={String(size)}
              onSelect={(val) => setSize(Number(val))}
              options={pageSizeOptions}
              placeholder="Size"
              align="left"
              fullWidth
            />
          </div>

          {/* Placeholder for alignment (empty) */}
          <div className=""></div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mt-4 border-t border-gray-100" />

      {/* Reset & Pagination */}
      <div className="px-5 pb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs text-gray-500">
          Page <span className="text-gray-800 font-mono">{page + 1}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetFilters}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors border border-gray-200"
            title="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}