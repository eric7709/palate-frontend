'use client';

import { useState, useEffect } from 'react';
import {
  useGetAllMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem
} from '@/models/menuItem/hooks';
import { useGetAllCategories } from '@/models/category/hooks';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  TrendingUp, Package, Layers, Edit, Trash2, X, Save,
  CheckCircle, XCircle, Plus, DollarSign,
  Image as ImageIcon, Upload, ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { MenuItemStatusEnum } from '@/models/menuItem/types';



const statusColor = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'ACTIVE') return 'bg-emerald-100 text-emerald-800';
  if (u === 'INACTIVE') return 'bg-gray-200 text-gray-700';
  if (u === 'OUT_OF_STOCK') return 'bg-red-100 text-red-800';
  return 'bg-blue-100 text-blue-800';
};

const statusLabel = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'ACTIVE') return 'Active';
  if (u === 'INACTIVE') return 'Inactive';
  if (u === 'OUT_OF_STOCK') return 'Out of stock';
  return s || 'Unknown';
};

const uploadImage = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Upload failed'); }
  return (await res.json()).url;
};

const inp = (error?: string) =>
  `w-full px-3 py-2 text-sm rounded-lg bg-gray-800/60 border text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${error
    ? 'border-red-500/60 focus:ring-red-500/40'
    : 'border-gray-700/60 focus:ring-gray-500'
  }`;

// ─── Validation ───────────────────────────────────────────────────────────────

interface FD {
  name: string; description: string; price: string;
  status: MenuItemStatusEnum; imageFile: File | null;
  imagePreview: string; imageUrl: string; categoryId: string;
}

interface FDErrors {
  name?: string; description?: string; price?: string; categoryId?: string;
}

const validate = (fd: FD): FDErrors => {
  const errors: FDErrors = {};
  if (!fd.name.trim()) errors.name = 'Name is required';
  if (!fd.description.trim()) errors.description = 'Description is required';
  if (!fd.categoryId) errors.categoryId = 'Category is required';
  if (!fd.price || isNaN(parseFloat(fd.price)) || parseFloat(fd.price) <= 0)
    errors.price = 'Enter a valid price greater than 0';
  return errors;
};

// ─── FormField ────────────────────────────────────────────────────────────────

const FF = ({ label, req, error, children }: {
  label: string; req?: boolean; error?: string; children: React.ReactNode
}) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">
      {label}{req && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 mt-1 text-[10px] text-red-400">
        <AlertCircle className="w-2.5 h-2.5 shrink-0" />{error}
      </p>
    )}
  </div>
);

// ─── Item Form ────────────────────────────────────────────────────────────────

const ItemForm = ({
  fd, setFd, categories, catLoading, uploading, errors, setErrors
}: {
  fd: FD; setFd: (d: FD) => void; categories: any[];
  catLoading: boolean; uploading: boolean;
  errors: FDErrors; setErrors: (e: FDErrors) => void;
}) => {

  const clear = (field: keyof FDErrors) =>
    errors[field] && setErrors({ ...errors, [field]: undefined });

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!valid.includes(file.type)) { alert('Invalid image type'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    setFd({ ...fd, imageFile: file, imagePreview: URL.createObjectURL(file) });
  };

  return (
    <div className="space-y-3">
      <FF label="Name" req error={errors.name}>
        <input
          type="text" value={fd.name}
          onChange={e => { setFd({ ...fd, name: e.target.value }); clear('name'); }}
          className={inp(errors.name)} placeholder="Item name"
        />
      </FF>

      <div className="grid grid-cols-2 gap-3">
        <FF label="Category" req error={errors.categoryId}>
          {catLoading
            ? <div className={`${inp()} flex items-center gap-2`}>
              <Loader className="w-3.5 h-3.5 animate-spin text-gray-500" />
              <span className="text-gray-500">Loading…</span>
            </div>
            : <div className="relative">
              <select
                value={fd.categoryId}
                onChange={e => { setFd({ ...fd, categoryId: e.target.value }); clear('categoryId'); }}
                className={`${inp(errors.categoryId)} appearance-none`}
              >
                <option value="">Select…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          }
        </FF>

        <FF label="Price" req error={errors.price}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
            <input
              type="number" step="0.01" value={fd.price}
              onChange={e => { setFd({ ...fd, price: e.target.value }); clear('price'); }}
              className={`${inp(errors.price)} pl-6`} placeholder="0.00"
            />
          </div>
        </FF>
      </div>

      <FF label="Description" error={errors.description}>
        <textarea
          value={fd.description}
          onChange={e => { setFd({ ...fd, description: e.target.value }); clear('description'); }}
          rows={2} className={`${inp(errors.description)} resize-none`} placeholder="Description"
        />
      </FF>

      <FF label="Image">
        <label className={`${inp()} flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-700/40 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading
            ? <><Loader className="w-3.5 h-3.5 animate-spin" /><span>Uploading…</span></>
            : <><Upload className="w-3.5 h-3.5" /><span>Choose image</span></>}
          <input type="file" accept="image/*" onChange={handleImg} className="hidden" disabled={uploading} />
        </label>
        <p className="text-[10px] text-gray-500 mt-1">Max 5MB · JPEG, PNG, WEBP</p>
        {fd.imagePreview && (
          <div className="mt-2 relative rounded-lg overflow-hidden h-24 border border-gray-700/60 group">
            <img src={fd.imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setFd({ ...fd, imageFile: null, imagePreview: '', imageUrl: '' })}
              className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </FF>

      <FF label="Status">
        <select
          value={fd.status}
          onChange={e => setFd({ ...fd, status: e.target.value as MenuItemStatusEnum })}
          className={inp()}
        >
          <option value={MenuItemStatusEnum.AVAILABLE}>Available</option>
          <option value={MenuItemStatusEnum.UNAVAILABLE}>Unavailable</option>
        </select>
      </FF>
    </div>
  );
};

// ─── Modal wrapper ────────────────────────────────────────────────────────────

const Modal = ({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode
}) => (
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const Base = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [uploading, setUploading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const empty: FD = {
    name: '', description: '', price: '', status: MenuItemStatusEnum.AVAILABLE,
    imageFile: null, imagePreview: '', imageUrl: '', categoryId: ''
  };
  const [fd, setFd] = useState<FD>(empty);
  const [errors, setErrors] = useState<FDErrors>({});

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>
    ({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const { data: itemsData, isLoading, error, refetch } = useGetAllMenuItems({ page: 0, size: 1000, sortDirection: 'desc', sortBy: 'id' });
  const { data: catsData, isLoading: catLoading } = useGetAllCategories({ page: 0, size: 1000, sortDirection: 'asc', sortBy: 'id' });

  const cats = catsData?.content || [];
  const items = itemsData?.content || [];
  const filtered = items.filter((i: any) =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.description?.toLowerCase().includes(search.toLowerCase()) ||
    i.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalVal = items.reduce((s: number, i: any) => s + (i.price || 0), 0);
  const activeCount = items.filter((i: any) => i.status?.toUpperCase() === 'ACTIVE').length;

  useEffect(() => () => {
    if (fd.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(fd.imagePreview);
  }, [fd.imagePreview]);

  const createMut = useCreateMenuItem();
  const updateMut = useUpdateMenuItem();
  const deleteMut = useDeleteMenuItem();

  const closeCreate = () => { setCreateOpen(false); setFd(empty); setErrors({}); };
  const closeEdit = () => { setEditOpen(false); setFd(empty); setErrors({}); };

  // Quick status toggle (Active <-> Inactive)
  const handleQuickStatusToggle = async (item: any) => {
    const current = item.status?.toUpperCase();
    let newStatus: MenuItemStatusEnum;
    if (current === MenuItemStatusEnum.AVAILABLE) {
      newStatus = MenuItemStatusEnum.UNAVAILABLE;
    } else {
      newStatus = MenuItemStatusEnum.AVAILABLE;
    }
    try {
      await updateMut.mutateAsync({
        id: item.id,
        dto: {
          name: item.name,
          description: item.description || '',
          price: item.price,
          status: newStatus,
          imageUrl: item.imageUrl || '',
          categoryId: item.categoryId
        }
      });
      showToast(`Status changed to ${statusLabel(newStatus)}`, 'success');
      refetch();
    } catch (e: any) {
      showToast(e?.message || 'Status update failed', 'error');
    }
  };

  // Create
  const onCreateSubmit = async () => {
    const errs = validate(fd);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      let url = '';
      if (fd.imageFile) { setUploading(true); url = await uploadImage(fd.imageFile); setUploading(false); }
      await createMut.mutateAsync({
        name: fd.name, description: fd.description,
        price: parseFloat(fd.price), status: fd.status, imageUrl: url, categoryId: parseInt(fd.categoryId)
      });
      showToast('Item created!', 'success'); closeCreate(); refetch();
    } catch (e: any) { setUploading(false); showToast(e?.message || 'Failed', 'error'); }
  };

  // Edit
  const onEditClick = (item: any) => {
    setSelected(item);
    setErrors({});
    setFd({
      name: item.name, description: item.description || '', price: item.price?.toString() || '',
      status: item.status as MenuItemStatusEnum, imageFile: null,
      imagePreview: item.imageUrl || '', imageUrl: item.imageUrl || '',
      categoryId: item.categoryId ? item.categoryId.toString() : ''
    });
    setEditOpen(true);
  };

  const onEditSubmit = async () => {
    const errs = validate(fd);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!selected) return;
    try {
      let url = fd.imageUrl;
      if (fd.imageFile) { setUploading(true); url = await uploadImage(fd.imageFile); setUploading(false); }
      await updateMut.mutateAsync({
        id: selected.id, dto: {
          name: fd.name, description: fd.description,
          price: parseFloat(fd.price), status: fd.status, imageUrl: url, categoryId: parseInt(fd.categoryId)
        }
      });
      showToast('Item updated!', 'success'); closeEdit(); setSelected(null); refetch();
    } catch (e: any) { setUploading(false); showToast(e?.message || 'Failed', 'error'); }
  };

  // Delete
  const onDeleteConfirm = async () => {
    if (!selected) return;
    try {
      await deleteMut.mutateAsync(selected.id);
      showToast('Item deleted!', 'success'); setDeleteOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.message || 'Failed', 'error'); }
  };

  const ModalBtns = ({ onCancel, onConfirm, confirmLabel, loading, danger }: {
    onCancel: () => void; onConfirm: () => void;
    confirmLabel: React.ReactNode; loading: boolean; danger?: boolean;
  }) => (
    <div className="flex gap-2 px-4 py-3 border-t border-gray-700/60">
      <button onClick={onCancel}
        className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors">
        Cancel
      </button>
      <button onClick={onConfirm} disabled={loading}
        className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${danger
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}>
        {loading
          ? <><Loader className="w-3.5 h-3.5 animate-spin" />{uploading ? 'Uploading…' : 'Saving…'}</>
          : confirmLabel}
      </button>
    </div>
  );

  return (
    <div className="p-3 text-white">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* Toast */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-xl border text-sm font-medium ${toast.type === 'success'
              ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
              : 'bg-red-500/90 border-red-400/50 text-white'
              }`}>
              {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {toast.msg}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold">Menu Items</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Manage your restaurant menu</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setFd(empty); setErrors({}); setCreateOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
            {(['table', 'grid'] as const).map(m => (
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
            { icon: Layers, label: 'Total items', value: items.length, cls: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Package, label: 'Categories', value: cats.length, cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: TrendingUp, label: 'Active', value: activeCount, cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: DollarSign, label: 'Total value', value: `₦${totalVal.toFixed(2)}`, cls: 'text-indigo-400', bg: 'bg-indigo-500/10' },
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
            placeholder="Search by name, description, or category…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all" />
        </div>

        {/* Content */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-500">Loading menu items…</p>
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
              <p className="text-sm text-gray-400">No menu items found</p>
              {search && <p className="text-xs text-gray-600">Try adjusting your search</p>}
            </div>
          )}

          {/* Table View */}
          {!isLoading && !error && filtered.length > 0 && view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/60">
                    {['#', 'Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {filtered.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{item.id}</td>
                      <td className="px-3 py-2">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-gray-700/60" />
                          : <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-500" /></div>}
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        {item.description && <p className="text-gray-500 text-[10px] mt-0.5 line-clamp-1">{item.description}</p>}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">{item.categoryName || 'Uncategorized'}</span>
                      </td>
                      <td className="px-3 py-2 text-emerald-400 font-medium text-sm">₦{item.price?.toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickStatusToggle(item)}
                            disabled={updateMut.isPending}
                            className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors disabled:opacity-50"
                            title="Toggle status (Active/Inactive)"
                          >
                            {item.status?.toUpperCase() === 'ACTIVE' ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onEditClick(item)}
                            disabled={updateMut.isPending}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setSelected(item); setDeleteOpen(true); }}
                            disabled={deleteMut.isPending}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
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
          )}

          {/* Grid View */}
          {!isLoading && !error && filtered.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {filtered.map((item: any) => (
                <div key={item.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-gray-700/60 shrink-0" />
                        : <div className="w-9 h-9 rounded-lg bg-gray-700/60 flex items-center justify-center shrink-0"><ImageIcon className="w-4 h-4 text-gray-500" /></div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-gray-500 text-[10px] truncate">{item.categoryName || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${statusColor(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  {item.description && <p className="text-gray-400 text-[11px] mb-2 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700/60">
                    <span className="text-emerald-400 font-medium text-sm">₦{item.price?.toFixed(2)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickStatusToggle(item)}
                        disabled={updateMut.isPending}
                        className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors disabled:opacity-50"
                        title="Toggle status"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditClick(item)}
                        disabled={updateMut.isPending}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setSelected(item); setDeleteOpen(true); }}
                        disabled={deleteMut.isPending}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                      >
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
            Showing {filtered.length} of {items.length} items
          </p>
        )}
      </div>

      {/* Create Modal */}
      {createOpen && (
        <Modal title="Add Menu Item" onClose={closeCreate}>
          <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
            <ItemForm fd={fd} setFd={setFd} categories={cats} catLoading={catLoading}
              uploading={uploading} errors={errors} setErrors={setErrors} />
          </div>
          <ModalBtns
            onCancel={closeCreate} onConfirm={onCreateSubmit}
            confirmLabel={<><Save className="w-3.5 h-3.5" /> Save item</>}
            loading={createMut.isPending || uploading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <Modal title="Edit Menu Item" onClose={closeEdit}>
          <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
            <ItemForm fd={fd} setFd={setFd} categories={cats} catLoading={catLoading}
              uploading={uploading} errors={errors} setErrors={setErrors} />
          </div>
          <ModalBtns
            onCancel={closeEdit} onConfirm={onEditSubmit}
            confirmLabel={<><Save className="w-3.5 h-3.5" /> Save</>}
            loading={updateMut.isPending || uploading}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteOpen && (
        <Modal title="Delete item" onClose={() => setDeleteOpen(false)}>
          <div className="px-4 py-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Are you sure?</p>
            <p className="text-xs text-gray-400">
              You're about to delete <span className="text-white font-medium">"{selected?.name}"</span>. This cannot be undone.
            </p>
          </div>
          <ModalBtns
            onCancel={() => setDeleteOpen(false)} onConfirm={onDeleteConfirm}
            confirmLabel="Delete" loading={deleteMut.isPending} danger
          />
        </Modal>
      )}
    </div>
  );
};