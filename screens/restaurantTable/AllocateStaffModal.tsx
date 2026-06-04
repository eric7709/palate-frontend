"use client";

import { useState } from "react";
import { XCircle, UserPlus } from "lucide-react";
import CustomSelect from "@/ui/CustomSelect";
import { useAllocateStaff } from "@/models/tableAllocation/hooks";
import { useGetWaiterOptions, useGetCashierOptions } from "@/models/employee/hooks";

interface AllocateStaffModalProps {
  tableId: number;
  tableName: string;
  role: "waiter" | "cashier";
  onClose: () => void;
  onSuccess: () => void;
}

export function AllocateStaffModal({ tableId, tableName, role, onClose, onSuccess }: AllocateStaffModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-87.5 bg-[#0e0f14] border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Allocate {role === "waiter" ? "Waiter" : "Cashier"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-gray-400">
            Table <span className="text-white font-medium">{tableName}</span> — Select a {role} to assign.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Select {role === "waiter" ? "Waiter" : "Cashier"}
            </label>
            <CustomSelect
              value={selectedStaffId ? String(selectedStaffId) : ""}
              onSelect={(val) => setSelectedStaffId(val ? Number(val) : null)}
              options={selectOptions}
              placeholder={`Choose ${role}`}
              align="left"
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={!selectedStaffId || isPending}
            className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Allocating..." : "Allocate"}
          </button>
        </div>
      </div>
    </div>
  );
}