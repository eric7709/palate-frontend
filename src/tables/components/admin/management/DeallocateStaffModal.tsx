"use client";

import { X, AlertTriangle } from "lucide-react";
import { useDeallocateStaff } from "@/src/tableAllocation/hooks/hooks.api";

interface DeallocateStaffModalProps {
  tableId: number;
  tableName: string;
  staffId: number;
  staffName: string;
  role: "waiter" | "cashier";
  onClose: () => void;
  onSuccess: () => void;
}

export function DeallocateStaffModal({
  tableId,
  tableName,
  staffId,
  staffName,
  role,
  onClose,
  onSuccess,
}: DeallocateStaffModalProps) {
  const { mutate: deallocateStaff, isPending } = useDeallocateStaff();

  const handleDeallocate = () => {
    deallocateStaff(
      { tableId, staffId },
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
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-700">
              Deallocate {role === "waiter" ? "Waiter" : "Cashier"}
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
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to deallocate{" "}
            <span className="font-semibold text-gray-700">{staffName}</span> from{" "}
            <span className="font-semibold text-gray-700">{tableName}</span>?
          </p>
          <p className="text-xs text-gray-500">
            This will end the current allocation and free the staff member.
          </p>
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
            onClick={handleDeallocate}
            disabled={isPending}
            className="flex-1 px-3 py-3 rounded-lg bg-rose-500 text-xs font-semibold text-white hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {isPending ? "Deallocating..." : "Deallocate"}
          </button>
        </div>
      </div>
    </div>
  );
}