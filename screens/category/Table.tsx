"use client";

import { useGetAllCategories } from '@/models/category/hooks';
import { useCategoryStore } from '@/models/category/store';
import { Edit, Trash2, Circle } from 'lucide-react';
import NoRecords from '../../ui/NoRecords';
import { TableSkeleton } from '@/ui/TableSkeleton';

const HEADERS = ['Name', 'Description', 'Items', 'Status', 'Actions'];

const statusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'active':   return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
    case 'inactive': return 'bg-gray-50 text-gray-600 border border-gray-200/50';
    default:         return 'bg-gray-50 text-gray-600 border border-gray-200/50';
  }
};

const statusDot = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'active':   return 'bg-emerald-500';
    case 'inactive': return 'bg-gray-400';
    default:         return 'bg-gray-400';
  }
};

export default function Table() {
  const { data, isLoading } = useGetAllCategories();
  const { search, setModal, setSelectedCategory } = useCategoryStore();

  // 🟢 FIXED: If data hasn't arrived yet, always force the skeleton. 
  // This blocks the brief state-hydration gap where isLoading might be false before connecting.
  if (isLoading || !data) {
    return <TableSkeleton columns={5} rows={8} />;
  }
  
  if (!data?.content?.length) {
    return <NoRecords title="Category" description="No categories found" />;
  }

  const filtered = data.content.filter((cat) => {
    const q = search.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    return <NoRecords title="Category" description="No matching categories" />;
  }

  const handleEdit = (cat: any) => { setSelectedCategory(cat); setModal('editCategory'); };
  const handleDelete = (cat: any) => { setSelectedCategory(cat); setModal('deleteCategory'); };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            {HEADERS.map((h) => (
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
          {filtered.map((cat) => (
            <tr
              key={cat.id}
              className="group transition-all duration-150 hover:bg-linear-to-r hover:from-gray-50/80 hover:to-transparent"
            >
              {/* Name */}
              <td className="px-3 py-2.5">
                <p className="text-xs font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </p>
               </td>

              {/* Description */}
              <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-normal max-w-md group-hover:text-gray-700">
                {cat.description || '—'}
               </td>

              {/* Items count */}
              <td className="px-3 py-2.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50/80 text-gray-600 text-xs font-medium border border-gray-100/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {cat.menuItemCount ?? 0} items
                </div>
               </td>

              {/* Status */}
              <td className="px-3 py-2.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor(cat.status)}`}
                >
                  <Circle className={`w-1.5 h-1.5 fill-current ${statusDot(cat.status)}`} />
                  {cat.status?.toUpperCase() || 'UNKNOWN'}
                </div>
               </td>

              {/* Actions */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Edit category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Delete category"
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