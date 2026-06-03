// Table.tsx
import { useGetAllCategories } from '@/models/category/hooks';
import { useCategoryStore } from '@/models/category/store';
import { Edit, Trash2, Package } from 'lucide-react';

const statusColor = (s: string) => {
  const l = s?.toLowerCase();
  if (l === 'active') return 'bg-emerald-100 text-emerald-800';
  if (l === 'inactive') return 'bg-gray-200 text-gray-700';
  return 'bg-blue-100 text-blue-800';
};

export default function Table() {
  const { data } = useGetAllCategories();
  const { search, setModal, setSelectedCategory } = useCategoryStore(); // add setSelectedCategory
  const categories = data?.content;

  const filtered = categories?.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered?.length === 0) return null;

  const handleEdit = (cat: any) => {
    setSelectedCategory(cat);
    setModal('editCategory');
  };

  const handleDelete = (cat: any) => {
    setSelectedCategory(cat);
    setModal('deleteCategory');
  };

  return (
    <div className="overflow-x-auto   border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950 rounded-3xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/60">
            {['#', 'Name', 'Description', 'Items', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {filtered?.map((cat, index) => (
            <tr key={cat.id} className="hover:bg-gray-700/20 transition-colors">
              <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
              <td className="px-3 py-2 text-white text-[12.5px] font-medium">{cat.name}</td>
              <td className="px-3 py-2 text-gray-400 text-xs whitespace-normal max-w-md">
                {cat.description || '—'}
              </td>
              <td className="px-3 py-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">
                  {cat.menuItemCount || 0} items
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(cat.status)}`}>
                  {cat.status || 'Unknown'}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
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