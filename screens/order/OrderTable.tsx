"use client"
import { useGetAllOrders } from '@/models/order/hooks'
import { useOrderStore } from '@/models/order/store'
import { OrderResponseDTO, OrderStatus } from '@/models/order/types'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import OrderDetailsModal from './OrderDetailsModal'

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

export default function OrderTable() {
  const {
    page, size, search, status, waiterId, cashierId,
    tableId, minTotal, maxTotal, startDate, endDate,
    sortBy, sortDirection,
  } = useOrderStore()

  const { data, isLoading } = useGetAllOrders({
    page, size, search, status, waiterId, cashierId,
    tableId, minTotal, maxTotal, startDate, endDate,
    sortBy, sortDirection,
  })

  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null)

  const orders = data?.orders?.content ?? []
  if (isLoading) return null
  if (orders.length === 0) return null

  return (
    <>
      <div className="overflow-x-auto border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 rounded-3xl
      ">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/60">
              {['#', 'Invoice', 'Table', 'Customer', 'Waiter', 'Cashier', 'Total', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/40">
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
                <td className="px-3 py-2 text-white text-xs font-medium">{order.invoiceNumber}</td>
                <td className="px-3 py-2 text-gray-400 text-xs">{order.table?.tableName || '—'}</td>
                <td className="px-3 py-2 text-gray-200 text-xs font-semibold">{order.customer?.title}. {order.customer?.name || 'Guest'}</td>
                <td className="px-3 py-2 text-gray-400 text-xs">{order.waiter?.fullName || '—'}</td>
                <td className="px-3 py-2 text-gray-400 text-xs">{order.cashier?.fullName || '—'}</td>
                <td className="px-3 py-2 text-white text-xs font-medium">{formatCurrency(order.total)}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}