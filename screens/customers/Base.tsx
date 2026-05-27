'use client';

import { useState } from 'react';
import {
  useGetAllCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
  useCreateCustomer
} from '@/models/customer/hooks';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  Filter, TrendingUp, Package, Layers, Edit, Trash2,
  X, Save, CheckCircle, XCircle, Plus, Users, User,
  Mail, Phone
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const titleColor = (t: string) => {
  const l = t?.toLowerCase() || '';
  if (l.includes('mr') && !l.includes('mrs')) return 'bg-blue-100 text-blue-800';
  if (l.includes('mrs')) return 'bg-pink-100 text-pink-800';
  if (l.includes('ms'))  return 'bg-purple-100 text-purple-800';
  if (l.includes('dr'))  return 'bg-emerald-100 text-emerald-800';
  return 'bg-gray-200 text-gray-700';
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
  const [search, setSearch] = useState('');
  const [view, setView]     = useState<'table' | 'grid'>('table');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected,   setSelected]   = useState<any>(null);

  const emptyForm = { name: '', title: '', phoneNumber: '', email: '' };
  const [createFd, setCreateFd] = useState(emptyForm);
  const [editFd,   setEditFd]   = useState(emptyForm);

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success'|'error' }>
    ({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const { data: customersData, isLoading, error, refetch } = useGetAllCustomers({
    page: 0, size: 1000, sortDirection: 'asc', sortBy: 'id'
  });

  const customers = customersData?.content || [];
  const filtered  = customers.filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  const withEmail = customers.filter((c: any) => c.email).length;
  const withPhone = customers.filter((c: any) => c.phoneNumber).length;

  const createMut = useCreateCustomer();
  const updateMut = useUpdateCustomer();
  const deleteMut = useDeleteCustomer();

  // ── Create ──
  const onCreateSubmit = async () => {
    try {
      await createMut.mutateAsync(createFd);
      showToast('Customer created!', 'success');
      setCreateOpen(false); setCreateFd(emptyForm); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Edit ──
  const onEditClick = (c: any) => {
    setSelected(c);
    setEditFd({ name: c.name, title: c.title || '', phoneNumber: c.phoneNumber || '', email: c.email || '' });
    setEditOpen(true);
  };
  const onEditSubmit = async () => {
    if (!selected) return;
    try {
      await updateMut.mutateAsync({ id: selected.id, dto: editFd });
      showToast('Customer updated!', 'success');
      setEditOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Delete ──
  const onDeleteConfirm = async () => {
    if (!selected) return;
    try {
      await deleteMut.mutateAsync(selected.id);
      showToast('Customer deleted!', 'success');
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
            <h1 className="text-lg font-semibold">Customers</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Manage your restaurant customers</p>
          </div>
          <div className="flex items-center gap-2">
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
            { icon: Users,  label: 'Total customers', value: customers.length, cls: 'text-blue-400',    bg: 'bg-blue-500/10'    },
            { icon: Mail,   label: 'With email',      value: withEmail,        cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Phone,  label: 'With phone',      value: withPhone,        cls: 'text-purple-400',  bg: 'bg-purple-500/10'  },
            { icon: Filter, label: 'Filtered',        value: filtered.length,  cls: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
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
            placeholder="Search by name, title, email, or phone…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all" />
        </div>

        {/* Content */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-500">Loading customers…</p>
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
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400">No customers found</p>
              {search
                ? <p className="text-xs text-gray-600">Try adjusting your search</p>
                : <button onClick={() => setCreateOpen(true)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    Add your first customer
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
                    {['#','Name','Title','Email','Phone','Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {filtered.map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{c.id}</td>
                      <td className="px-3 py-2 text-white text-sm font-medium">{c.name}</td>
                      <td className="px-3 py-2">
                        {c.title
                          ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${titleColor(c.title)}`}>{c.title}</span>
                          : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-400 text-xs">{c.email || '—'}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs">{c.phoneNumber || '—'}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => onEditClick(c)} disabled={updateMut.isPending}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setSelected(c); setDeleteOpen(true); }} disabled={deleteMut.isPending}
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
              {filtered.map((c: any) => (
                <div key={c.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">{c.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    {c.title && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${titleColor(c.title)}`}>
                        {c.title}
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium mt-2">{c.name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">{c.email || 'No email'}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/60">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] text-gray-400">{c.phoneNumber || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onEditClick(c)} disabled={updateMut.isPending}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setSelected(c); setDeleteOpen(true); }} disabled={deleteMut.isPending}
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
            Showing {filtered.length} of {customers.length} customers
          </p>
        )}
      </div>

      {/* ── Create Modal ── */}
      {createOpen && (
        <Modal title="Add Customer" onClose={() => setCreateOpen(false)}>
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name <span className="text-red-400">*</span></label>
              <input type="text" value={createFd.name} onChange={e => setCreateFd({ ...createFd, name: e.target.value })}
                className={inp} placeholder="Customer name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <select value={createFd.title} onChange={e => setCreateFd({ ...createFd, title: e.target.value })} className={inp}>
                <option value="">Select title</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
              <input type="tel" value={createFd.phoneNumber} onChange={e => setCreateFd({ ...createFd, phoneNumber: e.target.value })}
                className={inp} placeholder="+1 234 567 8900" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input type="email" value={createFd.email} onChange={e => setCreateFd({ ...createFd, email: e.target.value })}
                className={inp} placeholder="customer@example.com" />
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
        <Modal title="Edit Customer" onClose={() => setEditOpen(false)}>
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input type="text" value={editFd.name} onChange={e => setEditFd({ ...editFd, name: e.target.value })}
                className={inp} placeholder="Customer name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <select value={editFd.title} onChange={e => setEditFd({ ...editFd, title: e.target.value })} className={inp}>
                <option value="">Select title</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
              <input type="tel" value={editFd.phoneNumber} onChange={e => setEditFd({ ...editFd, phoneNumber: e.target.value })}
                className={inp} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input type="email" value={editFd.email} onChange={e => setEditFd({ ...editFd, email: e.target.value })}
                className={inp} />
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
        <Modal title="Delete Customer" onClose={() => setDeleteOpen(false)}>
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