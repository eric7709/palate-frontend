"use client";

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAllocateCashier } from '@/src/room/hooks/hooks.api';
import { useGetAllEmployees } from '@/src/employees/hooks/hooks.api';
import CustomSelect from '@/src/shared/components/input/CustomSelect';

export function AllocateCashierModal({
  roomId,
  roomNumber,
  onClose,
  onSuccess,
}: {
  roomId: number;
  roomNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedCashierId, setSelectedCashierId] = useState<number | null>(null);
  const { mutate, isPending } = useAllocateCashier();
  const { data } = useGetAllEmployees({ page: 0, size: 1000 });

  const cashiers = (data?.content || []).filter((e) => e.role === 'ROLE_CASHIER');
  const cashierOptions = cashiers.map((c) => ({ value: c.id.toString(), label: `${c.firstName} ${c.lastName}` }));

  const handleAllocate = () => {
    if (!selectedCashierId) return;
    mutate(
      { id: roomId, cashierId: selectedCashierId },
      {
        onSuccess: () => {
          toast.success('Cashier allocated successfully');
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-87.5 bg-white border border-gray-200 rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-800">Allocate Cashier</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-3">
          <p className="text-sm text-gray-600">
            Room <span className="text-gray-900 font-medium">{roomNumber}</span> — Select a cashier to assign.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Select Cashier
            </label>
            <CustomSelect
              fullWidth
              value={selectedCashierId ? String(selectedCashierId) : ""}
              onSelect={(val) => setSelectedCashierId(val ? Number(val) : null)}
              options={cashierOptions}
              placeholder="Choose cashier"
              align="left"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={!selectedCashierId || isPending}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Allocating..." : "Allocate"}
          </button>
        </div>
      </div>
    </div>
  );
}