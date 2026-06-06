"use client";
// components/menuItem/MenuItemTable.tsx
import { useGetAllMenuItems, useUpdateMenuItem } from '@/models/menuItem/hooks';
import { useMenuItemStore } from '@/models/menuItem/store';
import { MenuItemResponseDTO, MenuItemStatus } from '@/models/menuItem/types';
import Loader from '@/ui/Loader';
import { Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

const statusColor = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'AVAILABLE') return 'bg-emerald-100 text-emerald-800';
  if (u === 'UNAVAILABLE') return 'bg-gray-200 text-gray-700';
  return 'bg-blue-100 text-blue-800';
};

const statusLabel = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'AVAILABLE') return 'Available';
  if (u === 'UNAVAILABLE') return 'Unavailable';
  return s || 'Unknown';
};


export default function MenuItemTable() {
  const { modal, setModal, setSelectedMenuItem, search } = useMenuItemStore()
  const { data, isLoading } = useGetAllMenuItems({ search })
  const { mutate, isPending } = useUpdateMenuItem()
  const items = data?.content
  if (items?.length === 0) return null;

  const onToggleStatus = (item: MenuItemResponseDTO) => {
    const status: MenuItemStatus = item.status == "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE"
    mutate({ id: item.id, payload: { ...item, status } })
  }

  return (
    <div className="overflow-x-auto   border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950
rounded-3xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/60">
            {['#', 'Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {items?.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-700/20 transition-colors">
              <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
              <td className="px-3 py-2">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover border border-gray-700/60"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </td>
              <td className="px-3 py-2">
                <p className="text-white text-[13px] font-medium">{item.name}</p>
                
              </td>
              <td className="px-3 py-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">
                  {item.categoryName || 'Uncategorized'}
                </span>
              </td>
              <td className="px-3 py-2 text-emerald-400 font-medium text-[12.5px]">
                ₦{item.price?.toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(
                    item.status
                  )}`}
                >
                  {statusLabel(item.status)}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleStatus(item)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors disabled:opacity-50"
                    title="Toggle status"
                  >
                    {item.status?.toUpperCase() === 'AVAILABLE' ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMenuItem(item)
                      setModal("editMenuItem")
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMenuItem(item)
                      setModal("deleteMenuItem")
                    }}
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
  );
}