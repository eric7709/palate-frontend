// OrderDetailsModal.tsx
import { OrderResponseDTO, OrderStatus } from '@/models/order/types'
import { XCircle, CreditCard, User2, Table2 } from 'lucide-react'


const statusColor = (status?: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PREPARING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    PAID: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return map[status ?? 'PENDING'] || 'bg-gray-500/10 text-gray-400'
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0)

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

//  border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950
// rounded-3xl

export default function OrderDetailsModal({ order, onClose }: { order: OrderResponseDTO; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-87.5 bg-linear-to-br from-blue-500/20 to-gray-950 rounded-xl shadow-2xl border-blue-500/30 border ">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white">Order #{order.invoiceNumber}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded cursor-pointer hover:bg-gray-700">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="p-4 space-y-4  max-h-[70vh] overflow-y-auto">
          {order.cashier && (
            <div className="flex items-center gap-2 text-xs border-blue-500/30 border text-gray-300 shadow-md px-3 py-2 rounded-lg">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cashier: <span className="font-medium text-white">{order.cashier.fullName}</span></span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${statusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-[10px] text-gray-500">{formatDateTime(order.createdAt)}</span>
          </div>
          <div className="grid grid-cols-3 border-blue-500/30 shadow-md border gap-2 p-2.5 rounded-lg text-center">
            <div><User2 className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Customer</p><p className="text-xs text-white font-medium">{order?.customer?.title}. {order.customer?.name || 'Guest'}</p></div>
            <div><Table2 className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Table</p><p className="text-xs text-white">{order.table?.tableName || '—'}</p></div>
            <div><User2 className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Waiter</p><p className="text-xs text-white">{order.waiter?.fullName || '—'}</p></div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-300 mb-2">Items</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-1">
                  <div>
                    <span className="text-white font-mono">{item.quantity}× </span>
                    <span className="text-gray-300">{item.menuItemName || `Item #${item.menuItemId}`}</span>
                    {item.takeOut && <span className="ml-2 text-[9px] text-gray-500">(takeout)</span>}
                  </div>
                  <span className="text-white font-semibold">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-700/60">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Total</span>
              <span className="text-white text-base font-bold">{formatCurrency(order.total)}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Quantity: {order.quantity} items</p>
          </div>
        </div>
      </div>
    </div>
  )
}