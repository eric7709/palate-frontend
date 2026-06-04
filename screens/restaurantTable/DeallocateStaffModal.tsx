// components/DeallocateStaffModal.tsx
"use client";

import { XCircle, AlertTriangle } from "lucide-react";
import { useDeallocateStaff } from "@/models/tableAllocation/hooks";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-87.5 bg-[#0e0f14] border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Deallocate {role === "waiter" ? "Waiter" : "Cashier"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-gray-300">
            Are you sure you want to deallocate <span className="font-semibold text-white">{staffName}</span> from{" "}
            <span className="font-semibold text-white">{tableName}</span>?
          </p>
          <p className="text-xs text-gray-500">
            This will end the current allocation and free the staff member.
          </p>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeallocate}
            disabled={isPending}
            className="flex-1 px-3 py-2 rounded-lg bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
          >
            {isPending ? "Deallocating..." : "Deallocate"}
          </button>
        </div>
      </div>
    </div>
  );
}