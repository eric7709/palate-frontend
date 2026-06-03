import { useGetAllCustomers, useDeleteCustomer } from '@/models/customer/hooks'
import { useCustomerStore } from '@/models/customer/store'
import { Edit, Trash2 } from 'lucide-react'

export default function CustomerTable() {
  const { search, setModal, setSelectedCustomer } = useCustomerStore()
  const { data } = useGetAllCustomers({ search })

  const customers = data?.content
  if (customers?.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-3xl border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/60">
            {['#', 'Name', 'Email', 'Phone', 'Actions'].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {customers?.map((customer, index) => (
            <tr key={customer.id} className="hover:bg-gray-700/20 transition-colors">
              <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
              <td className="px-3 py-2 text-white text-[13px] font-medium">{customer.title} {customer.name}</td>

              <td className="px-3 py-2 text-gray-400 text-xs">{customer.email || '—'}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{customer.phoneNumber || '—'}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedCustomer(customer); setModal('editCustomer'); }}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedCustomer(customer); setModal('deleteCustomer'); }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}