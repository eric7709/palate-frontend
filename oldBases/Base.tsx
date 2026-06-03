'use client';

import { useState } from 'react';
import {
  useGetAllTables,
  useUpdateTable,
  useDeleteTable
} from '@/models/restaurantTable/hooks';
import { useGetAllEmployees } from '@/models/employee/hooks';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  Filter, TrendingUp, Layers, Edit, Trash2, X, Save,
  CheckCircle, XCircle, User, Users, Coffee,
  DollarSign, ChevronDown, QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: number; firstName: string; lastName: string;
  email: string; phoneNumber: string; gender: string; status: string; role: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (s: string) => {
  const l = s?.toLowerCase();
  if (l === 'available') return 'bg-emerald-100 text-emerald-800';
  if (l === 'occupied')  return 'bg-red-100 text-red-800';
  if (l === 'reserved')  return 'bg-amber-100 text-amber-800';
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

// ─── Shared select with chevron ───────────────────────────────────────────────

const SelectField = ({ label, value, onChange, children, loading }: {
  label: string; value: string; onChange: (v: string) => void;
  children: React.ReactNode; loading?: boolean;
}) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    {loading
      ? <div className={`${inp} flex items-center gap-2`}><Loader className="w-3.5 h-3.5 animate-spin text-gray-500" /><span className="text-gray-500">Loading…</span></div>
      : <div className="relative">
          <select value={value} onChange={e => onChange(e.target.value)} className={`${inp} appearance-none`}>
            {children}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
    }
  </div>
);

// ─── Table Form ───────────────────────────────────────────────────────────────

interface TableFd {
  tableName: string; tableNumber: number; status: string;
  capacity: number; waiterId: number | undefined; cashierId: number | undefined;
}

const TableForm = ({ fd, setFd, waiters, cashiers, empLoading }: {
  fd: TableFd; setFd: (d: TableFd) => void;
  waiters: Employee[]; cashiers: Employee[]; empLoading: boolean;
}) => (
  <div className="px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
    <div>
      <label className="block text-xs text-gray-400 mb-1">Table Name <span className="text-red-400">*</span></label>
      <input type="text" value={fd.tableName} onChange={e => setFd({ ...fd, tableName: e.target.value })}
        className={inp} placeholder="e.g., Window Table" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Number <span className="text-red-400">*</span></label>
        <input type="number" value={fd.tableNumber} onChange={e => setFd({ ...fd, tableNumber: parseInt(e.target.value) || 0 })}
          className={inp} placeholder="1" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Capacity</label>
        <input type="number" value={fd.capacity} onChange={e => setFd({ ...fd, capacity: parseInt(e.target.value) || 0 })}
          className={inp} placeholder="4" />
      </div>
    </div>
    <SelectField label="Status" value={fd.status} onChange={v => setFd({ ...fd, status: v })}>
      <option value="AVAILABLE">Available</option>
      <option value="OCCUPIED">Occupied</option>
      <option value="RESERVED">Reserved</option>
    </SelectField>
    <SelectField label="Assign Waiter" value={fd.waiterId?.toString() || ''} onChange={v => setFd({ ...fd, waiterId: v ? parseInt(v) : undefined })} loading={empLoading}>
      <option value="">No waiter assigned</option>
      {waiters.map(w => <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>)}
    </SelectField>
    <SelectField label="Assign Cashier" value={fd.cashierId?.toString() || ''} onChange={v => setFd({ ...fd, cashierId: v ? parseInt(v) : undefined })} loading={empLoading}>
      <option value="">No cashier assigned</option>
      {cashiers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
    </SelectField>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const emptyFd: TableFd = { tableName: '', tableNumber: 0, status: 'AVAILABLE', capacity: 0, waiterId: undefined, cashierId: undefined };

export const Base = () => {
  const [search, setSearch] = useState('');
  const [view, setView]     = useState<'table' | 'grid'>('table');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qrOpen,     setQrOpen]     = useState(false);
  const [selected,   setSelected]   = useState<any>(null);

  const [createFd, setCreateFd] = useState<TableFd>(emptyFd);
  const [editFd,   setEditFd]   = useState<TableFd>(emptyFd);

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success'|'error' }>
    ({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const { data: tablesData, isLoading, error, refetch } = useGetAllTables({ page:0, size:1000, sortDirection:'asc', sortBy:'id' });
  const { data: empData, isLoading: empLoading } = useGetAllEmployees({ page:0, size:1000 });

  const employees: Employee[] = Array.isArray(empData) ? empData : (empData as any)?.content || [];
  const waiters  = employees.filter(e => ['ROLE_WAITER','WAITER'].includes(e.role?.toUpperCase()));
  const cashiers = employees.filter(e => ['ROLE_CASHIER','CASHIER'].includes(e.role?.toUpperCase()));

  const tables   = tablesData?.content || [];
  const filtered = tables.filter((t: any) =>
    t.tableName?.toLowerCase().includes(search.toLowerCase()) ||
    t.tableNumber?.toString().includes(search)
  );

  const totalCap  = tables.reduce((s: number, t: any) => s + (t.capacity || 0), 0);
  const available = tables.filter((t: any) => t.status?.toLowerCase() === 'available').length;
  const occupied  = tables.filter((t: any) => t.status?.toLowerCase() === 'occupied').length;

  const updateMut = useUpdateTable();
  const deleteMut = useDeleteTable();

  const getQrValue = (id: number) => `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${id}`;

  // ── Create ──
  const onCreateSubmit = async () => {
    try {
      showToast('Table created!', 'success');
      setCreateOpen(false); setCreateFd(emptyFd); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Edit ──
  const onEditClick = (t: any) => {
    setSelected(t);
    setEditFd({ tableName: t.tableName, tableNumber: t.tableNumber, status: t.status,
      capacity: t.capacity || 0, waiterId: t.waiterId, cashierId: t.cashierId });
    setEditOpen(true);
  };
  const onEditSubmit = async () => {
    if (!selected) return;
    try {
      await updateMut.mutateAsync({ id: selected.id, payload: { ...editFd } });
      showToast('Table updated!', 'success');
      setEditOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  // ── Delete ──
  const onDeleteConfirm = async () => {
    if (!selected) return;
    try {
      await deleteMut.mutateAsync(selected.id);
      showToast('Table deleted!', 'success');
      setDeleteOpen(false); setSelected(null); refetch();
    } catch (e: any) { showToast(e?.response?.data?.message || 'Failed', 'error'); }
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); showToast('URL copied!', 'success'); };

  // ── Action buttons shared ──
  const ActionBtns = ({ t }: { t: any }) => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => { setSelected(t); setQrOpen(true); }}
        className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors">
        <QrCode className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onEditClick(t)} disabled={updateMut.isPending}
        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors disabled:opacity-50">
        <Edit className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => { setSelected(t); setDeleteOpen(true); }} disabled={deleteMut.isPending}
        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

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
            <h1 className="text-lg font-semibold">Restaurant Tables</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Manage and monitor all tables</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCreateFd(emptyFd); setCreateOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
              <Coffee className="w-3.5 h-3.5" /> Add Table
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
            { icon: Layers,     label: 'Total tables',     value: tables.length, cls: 'text-blue-400',    bg: 'bg-blue-500/10'    },
            { icon: Users,      label: 'Total capacity',   value: totalCap,      cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: TrendingUp, label: 'Available',        value: available,     cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Filter,     label: 'Occupied',         value: occupied,      cls: 'text-red-400',     bg: 'bg-red-500/10'     },
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
            placeholder="Search by name or number…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all" />
        </div>

        {/* Content */}
        <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-500">Loading tables…</p>
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
                <Coffee className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400">No tables found</p>
              {search
                ? <p className="text-xs text-gray-600">Try adjusting your search</p>
                : <button onClick={() => setCreateOpen(true)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    Add your first table
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
                    {['#','Name','No.','Capacity','Waiter','Cashier','Status','Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {filtered.map((t: any) => (
                    <tr key={t.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{t.id}</td>
                      <td className="px-3 py-2 text-white text-sm font-medium">{t.tableName}</td>
                      <td className="px-3 py-2 text-gray-300 text-sm">{t.tableNumber}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">
                          <Users className="w-2.5 h-2.5" />{t.capacity || 0}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1"><User className="w-3 h-3 text-gray-500" /><span className="text-gray-400 text-xs">{t.waiterName || '—'}</span></div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-gray-500" /><span className="text-gray-400 text-xs">{t.cashierName || '—'}</span></div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(t.status)}`}>
                          {t.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-3 py-2"><ActionBtns t={t} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid view */}
          {!isLoading && !error && filtered.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
              {filtered.map((t: any) => (
                <div key={t.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/60 flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">{t.tableNumber}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(t.status)}`}>
                      {t.status || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mt-2">{t.tableName}</p>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-500" /><span className="text-gray-400 text-[11px]">{t.capacity || 0} seats</span></div>
                    <div className="flex items-center gap-1"><User className="w-3 h-3 text-gray-500" /><span className="text-gray-400 text-[11px] truncate">{t.waiterName || '—'}</span></div>
                    <div className="flex items-center gap-1 col-span-2"><DollarSign className="w-3 h-3 text-gray-500" /><span className="text-gray-400 text-[11px] truncate">{t.cashierName || '—'}</span></div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/60">
                    <span className="font-mono text-[10px] text-gray-600">#{t.id}</span>
                    <ActionBtns t={t} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !error && filtered.length > 0 && (
          <p className="text-center text-[10px] text-gray-600">
            Showing {filtered.length} of {tables.length} tables
          </p>
        )}
      </div>

      {/* ── QR Modal ── */}
      {qrOpen && selected && (
        <Modal title="Table QR Code" onClose={() => setQrOpen(false)}>
          <div className="px-4 py-3 text-center space-y-3">
            <div className="bg-white p-3 rounded-lg inline-block">
              <QRCodeSVG value={getQrValue(selected.id)} size={160} level="H" includeMargin />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{selected.tableName}</p>
              <p className="text-gray-500 text-xs">Table #{selected.tableNumber} · ID {selected.id}</p>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-2.5 text-left">
              <p className="text-[10px] text-gray-500 mb-1">Menu URL</p>
              <p className="text-blue-400 text-xs break-all">{getQrValue(selected.id)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => copyUrl(getQrValue(selected.id))}
                className="flex-1 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Copy URL
              </button>
              <button onClick={() => window.open(getQrValue(selected.id), '_blank')}
                className="flex-1 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                Open Menu
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Create Modal ── */}
      {createOpen && (
        <Modal title="Add Table" onClose={() => setCreateOpen(false)}>
          <TableForm fd={createFd} setFd={setCreateFd} waiters={waiters} cashiers={cashiers} empLoading={empLoading} />
          <ModalBtns
            onCancel={() => setCreateOpen(false)}
            onConfirm={onCreateSubmit}
            confirmLabel={<><Coffee className="w-3.5 h-3.5" /> Add Table</>}
            loading={false}
          />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editOpen && (
        <Modal title="Edit Table" onClose={() => setEditOpen(false)}>
          <TableForm fd={editFd} setFd={setEditFd} waiters={waiters} cashiers={cashiers} empLoading={empLoading} />
          <ModalBtns
            onCancel={() => setEditOpen(false)}
            onConfirm={onEditSubmit}
            confirmLabel={<><Save className="w-3.5 h-3.5" /> Save Changes</>}
            loading={updateMut.isPending}
          />
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {deleteOpen && (
        <Modal title="Delete Table" onClose={() => setDeleteOpen(false)}>
          <div className="px-4 py-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-medium text-white mb-1">Are you sure?</p>
            <p className="text-xs text-gray-400">
              You're about to delete <span className="text-white font-medium">"{selected?.tableName}"</span>. This cannot be undone.
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