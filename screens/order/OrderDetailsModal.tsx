"use client";
// OrderDetailsModal.tsx
import { OrderResponseDTO, OrderStatus } from '@/models/order/types';
import { XCircle, CreditCard, User2, Table2, DoorOpen } from 'lucide-react';

const statusBadgeStyle = (status?: OrderStatus) => {
  const base = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium";
  const map: Record<OrderStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200/50",
    PREPARING: "bg-blue-50 text-blue-700 border border-blue-200/50",
    COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    PAID: "bg-green-50 text-green-700 border border-green-200/50",
    CANCELLED: "bg-red-50 text-red-700 border border-red-200/50",
  };
  return `${base} ${map[status ?? 'PENDING'] || 'bg-gray-50 text-gray-600 border border-gray-200/50'}`;
};

const statusDotColor = (status?: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    PENDING: "bg-amber-500",
    PREPARING: "bg-blue-500",
    COMPLETED: "bg-emerald-500",
    PAID: "bg-green-500",
    CANCELLED: "bg-red-500",
  };
  return map[status ?? 'PENDING'] || "bg-gray-400";
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

interface OrderDetailsModalProps {
  order: OrderResponseDTO;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const isRoom = !!order.room || (!order.waiter && !order.table);
  const locationName = order.table?.tableName || order.room?.roomNumber || '—';
  const LocationIcon = isRoom ? DoorOpen : Table2;
  const locationLabel = isRoom ? 'Room' : 'Table';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-87.5 bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-800">Order #{order.invoiceNumber}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Cashier info */}
          {order.cashier && (
            <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-100 text-gray-600 rounded-lg px-3 py-2">
              <CreditCard className="w-3.5 h-3.5 text-gray-500" />
              <span>
                Cashier: <span className="font-medium text-gray-800">{order.cashier.fullName}</span>
              </span>
            </div>
          )}

          {/* Status + timestamp */}
          <div className="flex justify-between items-center">
            <div className={statusBadgeStyle(order.status)}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor(order.status)}`} />
              {order.status}
            </div>
            <span className="text-[10px] text-gray-400">{formatDateTime(order.createdAt)}</span>
          </div>

          {/* Customer / Location / Waiter grid */}
          <div className={`grid ${isRoom ? 'grid-cols-2' : 'grid-cols-3'} gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100 text-center`}>
            {/* Customer */}
            <div>
              <User2 className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-500">Customer</p>
              <p className="text-xs font-medium text-gray-800">{order.customer?.name || 'Guest'}</p>
            </div>

            {/* Table / Room */}
            <div>
              <LocationIcon className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-500">{locationLabel}</p>
              <p className="text-xs font-medium text-gray-800">{locationName}</p>
            </div>

            {/* Waiter (only for tables) */}
            {!isRoom && (
              <div>
                <User2 className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
                <p className="text-[10px] text-gray-500">Waiter</p>
                <p className="text-xs font-medium text-gray-800">{order.waiter?.fullName || '—'}</p>
              </div>
            )}
          </div>

          {/* Order items */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Items</p>
            <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2 border border-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-1 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="text-gray-800 font-mono">{item.quantity}× </span>
                    <span className="text-gray-700">{item.menuItemName || `Item #${item.menuItemId}`}</span>
                    {item.takeOut && <span className="ml-2 text-[9px] text-gray-400">(takeout)</span>}
                  </div>
                  <span className="text-gray-800 font-semibold">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Total</span>
              <span className="text-gray-900 text-base font-bold">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Quantity: {order.quantity} items</p>
          </div>
        </div>
      </div>
    </div>
  );
}