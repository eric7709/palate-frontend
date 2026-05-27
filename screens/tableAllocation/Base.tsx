'use client';

import { useState } from 'react';
import {
  useGetAllAllocations,
  useAllocateStaff,
  useDeallocateStaff
} from '@/models/tableAllocation/hooks';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  Filter, Edit, Trash2, X, Save, CheckCircle, XCircle,
  Plus, Users, User, Clock, TableProperties, UserCheck,
  UserMinus
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inp = 'w-full px-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all';

const formatDate = (s?: string) => {
  if (!s) return '—';
  return new Date(s).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
};

const roleColor = (role: 'cashier' | 'waiter') =>
  role === 'cashier' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800';

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

  const [allocateOpen,   setAllocateOpen]   = useState(false);
  const [deallocateOpen, setDeallocateOpen] = useState(false);
  const [selected,       setSelected]       = useState<any>(null);

  const emptyForm = { tableId: '', staffId: '', role: 'waiter' };
  const [allocateFd,   setAllocateFd]   = useState(emptyForm);
  const [deallocateFd, setDeallocateFd] = useState(emptyForm);

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>
    ({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const { data, isLoading, error, refetch } = useGetAllAllocations({
    page: 0, size: 1000, sortDirection: 'asc', sortBy: 'id'
  });

  const allocations = data?.content || [];
  const filtered = allocations.filter((a: any) => {
    const q = search.toLowerCase();
    return (
      String(a.id).includes(q) ||
      a.cashier?.fullName?.toLowerCase().includes(q) ||
      a.waiter?.fullName?.toLowerCase().includes(q)
    );
  });

  const withCashier = allocations.filter((a: any) => a.cashier).length;
  const withWaiter  = allocations.filter((a: any) => a.waiter).length;
  const fullyStaffed = allocations.filter((a: any) => a.cashier && a.waiter).length;

  const allocateMut   = useAllocateStaff();
  const deallocateMut = useDeallocateStaff();

  // ── Allocate ──
  const onAllocateSubmit = async () => {
    try {
      await allocateMut.mutateAsync({
        tableId: Number(allocateFd.tableId),
        staffId: Number(allocateFd.staffId)
      });
      showToast('Staff allocated!', 'success');
      setAllocateOpen(false); setAllocateFd(emptyForm); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Deallocate ──
  const onDeallocateOpen = (allocation: any) => {
    setSelected(allocation);
    setDeallocateFd({ tableId: String(allocation.id), staffId: '', role: 'waiter' });
    setDeallocateOpen(true);
  };
  const onDeallocateSubmit = async () => {
    if (!selected) return;
    try {
      await deallocateMut.mutateAsync({
        tableId: Number(deallocateFd.tableId),
        staffId: Number(deallocateFd.staffId)
      });
      showToast('Staff deallocated!', 'success');
      setDeallocateOpen(false); setSelected(null); refetch();
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
            <h1 className="text-lg font-semibold">Table Allocations</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Manage staff assigned to tables</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setAllocateFd(emptyForm); setAllocateOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /> Allocate Staff
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
            { icon: TableProperties, label: 'Total allocations', value: allocations.length,  cls: 'text-blue-400',    bg: 'bg-blue-500/10'    },
            { icon: UserCheck,       label: 'With cashier',      value: withCashier,          cls: 'text-orange-400',  bg: 'bg-orange-500/10'  },
            { icon: Users,           label: 'With waiter',       value: withWaiter,           cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Filter,          label: 'Filtered',          value: filtered.length,      cls: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
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
            placeholder="Search by allocation ID or staff name…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all" />
        </div>

        {/* Content */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-500">Loading allocations…</p>
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
                <TableProperties className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400">No allocations found</p>
              {search
                ? <p className="text-xs text-gray-600">Try adjusting your search</p>
                : <button onClick={() => setAllocateOpen(true)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    Allocate your first staff
                  </button>
              }
            </div>
          )}

          {/* Table view */}
          {!isLoading && !error && filtered.length > 0 && view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/60">
                    {['#', 'Cashier', 'Cashier In', 'Cashier Out', 'Waiter', 'Waiter In', 'Waiter Out', 'Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {filtered.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{a.id}</td>

                      <td className="px-3 py-2">
                        {a.cashier
                          ? <span className="text-white text-xs font-medium">{a.cashier.fullName}</span>
                          : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                          {a.cashierAllocatedAt && <Clock className="w-3 h-3 text-gray-600" />}
                          {formatDate(a.cashierAllocatedAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                          {a.cashierDeallocatedAt && <Clock className="w-3 h-3 text-gray-600" />}
                          {formatDate(a.cashierDeallocatedAt)}
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        {a.waiter
                          ? <span className="text-white text-xs font-medium">{a.waiter.fullName}</span>
                          : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                          {a.waiterAllocatedAt && <Clock className="w-3 h-3 text-gray-600" />}
                          {formatDate(a.waiterAllocatedAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                          {a.waiterDeallocatedAt && <Clock className="w-3 h-3 text-gray-600" />}
                          {formatDate(a.waiterDeallocatedAt)}
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => onDeallocateOpen(a)} disabled={deallocateMut.isPending}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                            title="Deallocate staff">
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid view */}
          {!isLoading && !error && filtered.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {filtered.map((a: any) => (
                <div key={a.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center shrink-0">
                      <TableProperties className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">#{a.id}</span>
                  </div>

                  {/* Cashier row */}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColor('cashier')}`}>Cashier</span>
                      <span className="text-white text-xs font-medium">{a.cashier?.fullName || '—'}</span>
                    </div>
                    {a.cashier && (
                      <div className="flex items-center gap-1 text-gray-500 text-[10px] pl-1">
                        <Clock className="w-3 h-3" />
                        <span>In: {formatDate(a.cashierAllocatedAt)}</span>
                        {a.cashierDeallocatedAt && <span className="ml-1">· Out: {formatDate(a.cashierDeallocatedAt)}</span>}
                      </div>
                    )}

                    {/* Waiter row */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColor('waiter')}`}>Waiter</span>
                      <span className="text-white text-xs font-medium">{a.waiter?.fullName || '—'}</span>
                    </div>
                    {a.waiter && (
                      <div className="flex items-center gap-1 text-gray-500 text-[10px] pl-1">
                        <Clock className="w-3 h-3" />
                        <span>In: {formatDate(a.waiterAllocatedAt)}</span>
                        {a.waiterDeallocatedAt && <span className="ml-1">· Out: {formatDate(a.waiterDeallocatedAt)}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-700/60">
                    <button onClick={() => onDeallocateOpen(a)} disabled={deallocateMut.isPending}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                      title="Deallocate staff">
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !error && filtered.length > 0 && (
          <p className="text-center text-[10px] text-gray-600">
            Showing {filtered.length} of {allocations.length} allocations
          </p>
        )}
      </div>

      {/* ── Allocate Modal ── */}
      {allocateOpen && (
        <Modal title="Allocate Staff" onClose={() => setAllocateOpen(false)}>
          <div className="px-4 py-3 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Table ID <span className="text-red-400">*</span></label>
              <input type="number" value={allocateFd.tableId}
                onChange={e => setAllocateFd({ ...allocateFd, tableId: e.target.value })}
                className={inp} placeholder="e.g. 12" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Staff ID <span className="text-red-400">*</span></label>
              <input type="number" value={allocateFd.staffId}
                onChange={e => setAllocateFd({ ...allocateFd, staffId: e.target.value })}
                className={inp} placeholder="e.g. 5" />
            </div>
          </div>
          <ModalBtns
            onCancel={() => setAllocateOpen(false)}
            onConfirm={onAllocateSubmit}
            confirmLabel={<><UserCheck className="w-3.5 h-3.5" /> Allocate</>}
            loading={allocateMut.isPending}
          />
        </Modal>
      )}

      {/* ── Deallocate Modal ── */}
      {deallocateOpen && (
        <Modal title="Deallocate Staff" onClose={() => setDeallocateOpen(false)}>
          <div className="px-4 py-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Deallocate staff?</p>
            <p className="text-xs text-gray-400 mb-3">
              Removing a staff member from allocation <span className="text-white font-medium">#{selected?.id}</span>. This cannot be undone.
            </p>
          </div>
          <div className="px-4 pb-1 space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Staff ID to remove <span className="text-red-400">*</span></label>
              <input type="number" value={deallocateFd.staffId}
                onChange={e => setDeallocateFd({ ...deallocateFd, staffId: e.target.value })}
                className={inp} placeholder="e.g. 5" />
            </div>
          </div>
          <ModalBtns
            onCancel={() => setDeallocateOpen(false)}
            onConfirm={onDeallocateSubmit}
            confirmLabel="Deallocate"
            loading={deallocateMut.isPending}
            danger
          />
        </Modal>
      )}
    </div>
  );
};