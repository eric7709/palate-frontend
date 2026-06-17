"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import CustomSelect from "@/src/shared/components/CustomSelect";
import { useAllocateStaff } from "@/src/tableAllocation/hooks/hooks.api";
import { useGetWaiterOptions, useGetCashierOptions } from "@/src/employees/hooks/hooks.api";

interface AllocateStaffModalProps {
  tableId: number;
  tableName: string;
  role: "waiter" | "cashier";
  onClose: () => void;
  onSuccess: () => void;
}

export function AllocateStaffModal({
  tableId,
  tableName,
  role,
  onClose,
  onSuccess,
}: AllocateStaffModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const { mutate: allocateStaff, isPending } = useAllocateStaff();

  const waiterOptions = useGetWaiterOptions();
  const cashierOptions = useGetCashierOptions();

  const options = role === "waiter" ? waiterOptions : cashierOptions;
  const selectOptions = options.map((opt) => ({ value: opt.value, label: opt.label }));

  const handleAllocate = () => {
    if (!selectedStaffId) return;
    allocateStaff(
      { tableId, staffId: selectedStaffId },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-87.5 bg-gray-50 border border-gray-200 rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/60">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Allocate {role === "waiter" ? "Waiter" : "Cashier"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200/70 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-gray-500">
            Table <span className="text-gray-700 font-medium">{tableName}</span> — Select a {role} to assign.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Select {role === "waiter" ? "Waiter" : "Cashier"}
            </label>
            <CustomSelect
              fullWidth
              value={selectedStaffId ? String(selectedStaffId) : ""}
              onSelect={(val) => setSelectedStaffId(val ? Number(val) : null)}
              options={selectOptions}
              placeholder={`Choose ${role}`}
              align="left"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200/60">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-3 rounded-lg bg-gray-200/70 text-xs font-medium text-gray-600 hover:bg-gray-300/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={!selectedStaffId || isPending}
            className="flex-1 px-3 py-3 cursor-pointer rounded-lg bg-blue-500 text-xs font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Allocating..." : "Allocate"}
          </button>
        </div>
      </div>
    </div>
  );
}