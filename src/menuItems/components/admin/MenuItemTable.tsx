"use client";
// components/menuItem/MenuItemTable.tsx
import { useGetAllMenuItems, useUpdateMenuItem } from '@/src/menuItems/hooks/hooks.api';
import { useMenuItemStore } from '@/src/menuItems/store';
import { MenuItemResponseDTO, MenuItemStatus } from '@/src/menuItems/types';
import { TableSkeleton } from '@/src/shared/components/TableSkeleton';
import NoRecords from '@/src/shared/components/NoRecords'; // 👈 import NoRecords
import { Edit, Trash2, Image as ImageIcon, Eye, EyeOff, Circle } from 'lucide-react';

const statusColor = (status?: string) => {
  const s = status?.toUpperCase();
  if (s === 'AVAILABLE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
  if (s === 'UNAVAILABLE') return 'bg-gray-50 text-gray-600 border border-gray-200/50';
  return 'bg-gray-50 text-gray-600 border border-gray-200/50';
};

const statusDot = (status?: string) => {
  const s = status?.toUpperCase();
  if (s === 'AVAILABLE') return 'bg-emerald-500';
  if (s === 'UNAVAILABLE') return 'bg-gray-400';
  return 'bg-gray-400';
};

const statusLabel = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'AVAILABLE') return 'AVAILABLE';
  if (u === 'UNAVAILABLE') return 'UNAVAILABLE';
  return s?.toUpperCase() || 'UNKNOWN';
};

export function MenuItemTable() {
  const { setModal, setSelectedMenuItem, search } = useMenuItemStore();
  const { data, isLoading } = useGetAllMenuItems({ search });
  const { mutate, isPending } = useUpdateMenuItem();
  const items = data?.content;

  const onToggleStatus = (item: MenuItemResponseDTO) => {
    const status: MenuItemStatus = item.status == "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    mutate({ id: item.id, payload: { ...item, status } });
  };

  if (isLoading) return <TableSkeleton rows={8} columns={7} />;

  if (!items?.length) {
    return (
      <NoRecords
        title="No menu items found"
        description="Add your first menu item to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            {['#', 'Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items?.map((item, index) => (
            <tr
              key={item.id}
              className="group transition-all duration-150 hover:bg-linear-to-r hover:from-gray-50/80 hover:to-transparent"
            >
              {/* # */}
              <td className="px-3 py-2.5 font-mono text-xs text-gray-400 group-hover:text-gray-500">
                #{index + 1}
              </td>

              {/* Image */}
              <td className="px-3 py-2.5">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="px-3 py-2.5">
                <p className="text-xs font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                  {item.name}
                </p>
              </td>

              {/* Category */}
              <td className="px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {item.categoryName || 'Uncategorized'}
                </span>
              </td>

              {/* Price */}
              <td className="px-3 py-2.5 text-xs font-bold text-gray-900">
                ₦{item.price?.toLocaleString()}
              </td>

              {/* Status */}
              <td className="px-3 py-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor(item.status)}`}
                >
                  <Circle className={`w-1.5 h-1.5 fill-current ${statusDot(item.status)}`} />
                  {statusLabel(item.status)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleStatus(item)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
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
                      setSelectedMenuItem(item);
                      setModal("editMenuItem");
                    }}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMenuItem(item);
                      setModal("deleteMenuItem");
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 hover:scale-105 active:scale-95"
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