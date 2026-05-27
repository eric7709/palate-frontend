'use client';

import { useState } from 'react';
import {
  useGetAllCategories,
  useUpdateCategory,
  useDeleteCategory,
  useCreateCategory
} from '@/models/category/hooks';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  Filter, TrendingUp, Package, Layers, Edit, Trash2,
  X, Save, CheckCircle, XCircle, Plus
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (s: string) => {
  const l = s?.toLowerCase();
  if (l === 'active')   return 'bg-emerald-100 text-emerald-800';
  if (l === 'inactive') return 'bg-gray-200 text-gray-700';
  return 'bg-blue-100 text-blue-800';
};

const inp = 'w-full px-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all';

// ─── Modal ────────────────────────────────────────────────────────────────────

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-xs bg-gray-800/95 border border-gray-700/60 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-700 transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ModalBtns = ({ onCancel, onConfirm, confirmLabel, loading, danger }:
  { onCancel: () => void; onConfirm: () => void; confirmLabel: React.ReactNode; loading: boolean; danger?: boolean }) => (
  <div className="flex gap-2 px-4 py-3 border-t border-gray-700/60">
    <button onClick={onCancel}
      className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors">
      Cancel
    </button>
    <button onClick={onConfirm} disabled={loading}
      className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${
        danger ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
               : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
      {loading ? <><Loader className="w-3.5 h-3.5 animate-spin" />Working…</> : confirmLabel}
    </button>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export const Base = () => {
  const [search, setSearch]   = useState('');
  const [view, setView]       = useState<'table' | 'grid'>('table');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected,   setSelected]   = useState<any>(null);

  const [createFd, setCreateFd] = useState({ name: '', description: '' });
  const [editFd,   setEditFd]   = useState({ name: '', description: '', status: '' });

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success'|'error' }>
    ({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const { data, isLoading, error, refetch } = useGetAllCategories({ page:0, size:1000, sortDirection:'asc', sortBy:'id' });
  const cats     = data?.content || [];
  const filtered = cats.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems     = cats.reduce((s: number, c: any) => s + (c.menuItemCount || 0), 0);
  const activeCount    = cats.filter((c: any) => c.status?.toLowerCase() === 'active').length;

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  // ── Create ──
  const onCreateSubmit = async () => {
    try {
      await createMut.mutateAsync({ name: createFd.name, description: createFd.description });
      showToast('Category created!', 'success');
      setCreateOpen(false); setCreateFd({ name:'', description:'' }); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Edit ──
  const onEditClick = (cat: any) => {
    setSelected(cat);
    setEditFd({ name: cat.name, description: cat.description || '', status: cat.status });
    setEditOpen(true);
  };
  const onEditSubmit = async () => {
    if (!selected) return;
    try {
      await updateMut.mutateAsync({ id: selected.id, dto: { name: editFd.name, description: editFd.description } });
      showToast('Category updated!', 'success');
      setEditOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Delete ──
  const onDeleteConfirm = async () => {
    if (!selected) return;
    try {
      await deleteMut.mutateAsync(selected.id);
      showToast('Category deleted!', 'success');
      setDeleteOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  return (
    <div className="p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* Toast */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-xl border text-sm font-medium ${
              toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
                                      : 'bg-red-500/90 border-red-400/50 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {toast.msg}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold">Categories</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Manage your restaurant categories</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCreateFd({ name:'', description:'' }); setCreateOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
            {(['table','grid'] as const).map(m => (
              <button key={m} onClick={() => setView(m)}
                className={`p-1.5 rounded-lg transition-colors ${view === m ? 'bg-gray-700 text-white' : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'}`}>
                {m === 'table' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: Layers,     label: 'Total categories', value: cats.length,        cls: 'text-blue-400',    bg: 'bg-blue-500/10'    },
            { icon: Package,    label: 'Total items',      value: totalItems,          cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: TrendingUp, label: 'Active',           value: activeCount,         cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Filter,     label: 'Filtered',         value: filtered.length,     cls: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
              <div className={`w-7 h-7 rounded-md ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.cls}`} />
              </div>
              <p className="text-lg font-semibold leading-none">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or description…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all" />
        </div>

        {/* Content */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-500">Loading categories…</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <AlertCircle className="w-7 h-7 text-red-400" />
              <p className="text-sm text-red-400">Something went wrong</p>
              <button onClick={() => refetch()} className="px-3 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600">Retry</button>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-700/60 flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400">No categories found</p>
              {search
                ? <p className="text-xs text-gray-600">Try adjusting your search</p>
                : <button onClick={() => setCreateOpen(true)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    Add your first category
                  </button>
              }
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && filtered.length > 0 && view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/60">
                    {['#','Name','Description','Items','Status','Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {filtered.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{cat.id}</td>
                      <td className="px-3 py-2 text-white text-sm font-medium">{cat.name}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs whitespace-normal break-words max-w-md">
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
                          <button onClick={() => onEditClick(cat)} disabled={updateMut.isPending}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setSelected(cat); setDeleteOpen(true); }} disabled={deleteMut.isPending}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && filtered.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {filtered.map((cat: any) => (
                <div key={cat.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">{cat.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(cat.status)}`}>
                      {cat.status || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mt-2">{cat.name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5 whitespace-normal break-words">
                    {cat.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/60">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] text-gray-400">{cat.menuItemCount || 0} items</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onEditClick(cat)} disabled={updateMut.isPending}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setSelected(cat); setDeleteOpen(true); }} disabled={deleteMut.isPending}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !error && filtered.length > 0 && (
          <p className="text-center text-[10px] text-gray-600">
            Showing {filtered.length} of {cats.length} categories
          </p>
        )}
      </div>

      {/* ── Create Modal ── */}
      {createOpen && (
        <Modal title="Add Category" onClose={() => setCreateOpen(false)}>
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name <span className="text-red-400">*</span></label>
              <input type="text" value={createFd.name} onChange={e => setCreateFd({ ...createFd, name: e.target.value })}
                className={inp} placeholder="Category name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={createFd.description} onChange={e => setCreateFd({ ...createFd, description: e.target.value })}
                rows={2} className={`${inp} resize-none`} placeholder="Description" />
            </div>
          </div>
          <ModalBtns
            onCancel={() => setCreateOpen(false)}
            onConfirm={onCreateSubmit}
            confirmLabel={<><Save className="w-3.5 h-3.5" /> Create</>}
            loading={createMut.isPending}
          />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editOpen && (
        <Modal title="Edit category" onClose={() => setEditOpen(false)}>
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input type="text" value={editFd.name} onChange={e => setEditFd({ ...editFd, name: e.target.value })}
                className={inp} placeholder="Category name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={editFd.description} onChange={e => setEditFd({ ...editFd, description: e.target.value })}
                rows={2} className={`${inp} resize-none`} placeholder="Description" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select value={editFd.status} onChange={e => setEditFd({ ...editFd, status: e.target.value })} className={inp}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <ModalBtns
            onCancel={() => setEditOpen(false)}
            onConfirm={onEditSubmit}
            confirmLabel={<><Save className="w-3.5 h-3.5" /> Save changes</>}
            loading={updateMut.isPending}
          />
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {deleteOpen && (
        <Modal title="Delete category" onClose={() => setDeleteOpen(false)}>
          <div className="px-4 py-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Are you sure?</p>
            <p className="text-xs text-gray-400">
              You're about to delete <span className="text-white font-medium">"{selected?.name}"</span>. This cannot be undone.
            </p>
            {selected?.menuItemCount > 0 && (
              <p className="text-amber-400 text-xs mt-2">
                ⚠ This category has {selected.menuItemCount} item(s) associated.
              </p>
            )}
          </div>
          <ModalBtns
            onCancel={() => setDeleteOpen(false)}
            onConfirm={onDeleteConfirm}
            confirmLabel="Delete"
            loading={deleteMut.isPending}
            danger
          />
        </Modal>
      )}
    </div>
  );
};