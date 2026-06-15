"use client"

import { XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useDeallocateCashier } from '@/models/room/hooks';

export function DeallocateCashierModal({
  roomId,
  roomNumber,
  cashierId,
  cashierName,
  onClose,
  onSuccess,
}: {
  roomId: number;
  roomNumber: string;
  cashierId: number;
  cashierName: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { mutate, isPending } = useDeallocateCashier();

  const handleDeallocate = () => {
    mutate(roomId, {
      onSuccess: () => {
        toast.success('Cashier deallocated successfully');
        onSuccess();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-gray-800/95 border border-gray-700/60 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
          <h3 className="text-sm font-medium text-white">Deallocate Cashier</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-700 transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          <p className="text-gray-400 text-sm">
            Remove <span className="text-white font-medium">{cashierName}</span> from room{' '}
            <span className="text-white font-medium">{roomNumber}</span>?
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/60 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeallocate}
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              {isPending ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}