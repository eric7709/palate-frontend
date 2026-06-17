"use client";

import { useGetAllCustomers } from '@/src/customers/hooks/hooks.api';
import { useCustomerStore } from '@/src/customers/store';
import { Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/src/shared/components/TableSkeleton';
import NoRecords from '@/src/shared/components/NoRecords';

// Predefined background colors for avatars (Tailwind bg classes)
const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];

export default function CustomerTable() {
  const { search, setModal, setSelectedCustomer } = useCustomerStore();
  const { data, isLoading } = useGetAllCustomers({ search });

  const customers = data?.content;

  if (isLoading) return <TableSkeleton rows={6} columns={4} />;

  if (!customers?.length) {
    return (
      <NoRecords
        title="No customers found"
        description="Add a customer to start building your client list."
      />
    );
  }

  // Get consistent color index based on customer id (or fallback to index)
  const getAvatarColor = (id: number) => {
    const index = id % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  };

  // Extract first letter from name (prefer customer name, fallback to title+name, then 'G')
  const getInitial = (customer: any) => {
    const name = customer.name?.trim();
    if (name && name.length > 0) return name.charAt(0).toUpperCase();
    const full = `${customer.title || ''} ${customer.name || ''}`.trim();
    if (full.length > 0) return full.charAt(0).toUpperCase();
    return 'G';
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers?.map((customer) => (
            <tr
              key={customer.id}
              className="group transition-all duration-150 hover:bg-linear-to-r hover:from-gray-50/80 hover:to-transparent"
            >
              {/* Customer (Avatar + Name) */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(customer.id)}`}
                  >
                    {getInitial(customer)}
                  </div>
                  <p className="text-xs font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                    {customer.title} {customer.name}
                  </p>
                </div>
               </td>

              {/* Email */}
              <td className="px-3 py-2.5 text-xs text-gray-500">
                {customer.email || '—'}
               </td>

              {/* Phone */}
              <td className="px-3 py-2.5 text-xs text-gray-500">
                {customer.phoneNumber || '—'}
               </td>

              {/* Actions */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedCustomer(customer); setModal('editCustomer'); }}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Edit customer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedCustomer(customer); setModal('deleteCustomer'); }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Delete customer"
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
  );
}