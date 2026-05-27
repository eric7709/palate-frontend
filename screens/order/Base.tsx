'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useGetAllTables } from '@/models/restaurantTable/hooks';
import { useGetAllEmployees } from '@/models/employee/hooks';
import { OrderStatus, OrderResponseDTO, OrderPageResponse } from '@/models/order/types';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader, AlertCircle, LayoutGrid, List, Search,
  Clock, ChefHat, DollarSign, ShoppingBag,
  Eye, RefreshCw, CheckCircle, XCircle,
  Filter, ArrowUp, ArrowDown, ChevronDown,
  User, Table, Receipt, CreditCard
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (status?: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PREPARING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    PAID: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };
  return map[status || 'PENDING'] || 'bg-gray-500/10 text-gray-400';
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Clean params: remove undefined, null, empty string
const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
};

// ─── Custom Select (unchanged) ───────────────────────────────────────────────

interface SelectOption {
  value: string | number;
  label: string;
}

function CustomSelect({ value, onChange, options, placeholder }: {
  value: string | number;
  onChange: (val: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white"
      >
        <span>{selected?.label || placeholder || 'Select'}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-md border border-white/10 bg-[#1e1f24] py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full px-2 py-1.5 text-left text-xs transition-colors hover:bg-white/10 ${opt.value === value ? 'bg-white/5 text-white' : 'text-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Order Details Modal (unchanged) ─────────────────────────────────────────

const OrderDetailsModal = ({ order, onClose }: { order: OrderResponseDTO; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-md bg-gray-800/95 border border-gray-700/60 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-white">Order #{order.invoiceNumber}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-700">
          <XCircle className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {order.cashier && (
          <div className="flex items-center gap-2 text-xs text-gray-300 bg-gray-700/30 px-3 py-2 rounded-lg">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cashier: <span className="font-medium text-white">{order.cashier.fullName}</span></span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className="text-[10px] text-gray-500">{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2 bg-gray-800/40 rounded-lg text-center">
          <div><User className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Customer</p><p className="text-xs text-white font-medium">{order.customer?.name || 'Guest'}</p></div>
          <div><Table className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Table</p><p className="text-xs text-white">{order.table?.tableName || `Table ${order.table?.tableNumber}` || '—'}</p></div>
          <div><User className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" /><p className="text-[10px] text-gray-400">Waiter</p><p className="text-xs text-white">{order.waiter?.fullName || '—'}</p></div>
        </div>
        <div><p className="text-xs font-medium text-gray-300 mb-2">Items</p><div className="space-y-2 max-h-48 overflow-y-auto">{order.items.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-xs border-b border-gray-700/40 pb-1"><div><span className="text-white font-mono">{item.quantity}× </span><span className="text-gray-300">{item.menuItemName || `Item #${item.menuItemId}`}</span>{item.takeOut && <span className="ml-2 text-[9px] text-gray-500">(takeout)</span>}</div><span className="text-white font-mono">{formatCurrency(item.price)}</span></div>))}</div></div>
        <div className="pt-2 border-t border-gray-700/60"><div className="flex justify-between items-center"><span className="text-gray-400 text-xs">Total</span><span className="text-white text-base font-bold">{formatCurrency(order.total)}</span></div><p className="text-[10px] text-gray-500 mt-1">Quantity: {order.quantity} items</p></div>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const OrdersBase = () => {
  // View mode (table / grid)
  const [view, setView] = useState<'table' | 'grid'>('table');

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(30);

  // Filter states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [waiterId, setWaiterId] = useState<number | null>(null);
  const [cashierId, setCashierId] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);
  const [minTotal, setMinTotal] = useState<number | null>(null);
  const [maxTotal, setMaxTotal] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [showFilters, setShowFilters] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => {
    console.log(rawParams, "RAW")
    setPage(0);
  }, [debouncedSearch, statusFilter, waiterId, cashierId, tableId, minTotal, maxTotal, startDate, endDate, sortBy, sortDirection]);

  // Fetch tables and employees for dropdowns
  const { data: tablesData } = useGetAllTables({ page: 0, size: 100 });
  const tables = tablesData?.content || [];
  const tableOptions: SelectOption[] = [{ value: '', label: 'All Tables' }, ...tables.map(t => ({ value: t.id, label: t.tableName || `Table ${t.tableNumber}` }))];

  const { data: employeesData } = useGetAllEmployees({ page: 0, size: 100 });
  const employees = employeesData?.content || [];
  const waiters = employees.filter(e => e.role === 'ROLE_WAITER');
  const cashiers = employees.filter(e => e.role === 'ROLE_CASHIER');
  const waiterOptions: SelectOption[] = [{ value: '', label: 'All Waiters' }, ...waiters.map(w => ({ value: w.id, label: `${w.firstName} ${w.lastName}` }))];
  const cashierOptions: SelectOption[] = [{ value: '', label: 'All Cashiers' }, ...cashiers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))];

  const sortByOptions: SelectOption[] = [
    { value: 'id', label: 'ID' },
    { value: 'invoiceNumber', label: 'Invoice #' },
    { value: 'total', label: 'Total' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'updatedAt', label: 'Updated At' },
  ];

  const pageSizeOptions: SelectOption[] = [
    { value: 10, label: '10 per page' },
    { value: 30, label: '30 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
  ];

  // Build raw params – use undefined for unset values (so they are filtered out)
  const rawParams = {
    page,
    size,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    waiterId: waiterId ?? undefined,
    cashierId: cashierId ?? undefined,
    tableId: tableId ?? undefined,
    minTotal: minTotal ?? undefined,
    maxTotal: maxTotal ?? undefined,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    sortBy,
    sortDirection,
  };

  // Clean params and call API
  const { data, isLoading, error, refetch } = useQuery<OrderPageResponse>({
    queryKey: ['orders', rawParams],
    queryFn: async () => {
      const cleaned = cleanParams(rawParams);
      const response = await api.get('/orders', { params: cleaned });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });


  const orders = data?.orders?.content ?? [];
  const statusCounts = data?.statusCounts;
  const totalElements = data?.orders?.totalElements ?? 0;
  const totalPages = data?.orders?.totalPages ?? 0;

  const openDetailsModal = (order: OrderResponseDTO) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('');
    setWaiterId(null);
    setCashierId(null);
    setTableId(null);
    setMinTotal(null);
    setMaxTotal(null);
    setStartDate(null);
    setEndDate(null);
    setSortBy('createdAt');
    setSortDirection('desc');
    setPage(0);
  };

  const totalOrders = statusCounts?.total ?? totalElements;
  const pendingCount = statusCounts?.pending ?? 0;
  const preparingCount = statusCounts?.preparing ?? 0;
  const completedCount = statusCounts?.completed ?? 0;
  const paidCount = statusCounts?.paid ?? 0;
  const cancelledCount = statusCounts?.cancelled ?? 0;

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 mt-2">
      <div className="text-xs text-gray-500">
        Showing {orders.length} of {totalElements} orders
      </div>
      <div className="flex items-center gap-2">
        <CustomSelect value={size} onChange={(val) => setSize(Number(val))} options={pageSizeOptions} placeholder="Page size" />
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(0)} disabled={page === 0} className="rounded-lg border border-white/10 bg-[#18191d] px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:opacity-40">First</button>
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="rounded-lg border border-white/10 bg-[#18191d] px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-400 px-2">Page {page + 1} of {totalPages || 1}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="rounded-lg border border-white/10 bg-[#18191d] px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-40">Next</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="rounded-lg border border-white/10 bg-[#18191d] px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10 disabled:opacity-40">Last</button>
        </div>
      </div>
    </div>
  );

  return (
      <div className="p-3 text-white">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Toast */}
          {toast.show && (
            <div className="fixed top-4 right-4 z-50">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-xl border text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
                {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {toast.msg}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div><h1 className="text-lg font-semibold">Orders</h1><p className="text-[11px] text-gray-500">View and track customer orders</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-white text-sm"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-white text-sm"><Filter className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-90' : ''}`} /> Filters</button>
              {(['table', 'grid'] as const).map(m => (<button key={m} onClick={() => setView(m)} className={`p-1.5 rounded-lg transition-colors ${view === m ? 'bg-gray-700 text-white' : 'bg-gray-800/60 text-gray-400'}`}>{m === 'table' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}</button>))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { icon: ShoppingBag, label: 'Total', value: totalOrders, cls: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: Clock, label: 'Pending', value: pendingCount, cls: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: ChefHat, label: 'Preparing', value: preparingCount, cls: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: CheckCircle, label: 'Completed', value: completedCount, cls: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: DollarSign, label: 'Paid', value: paidCount, cls: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: XCircle, label: 'Cancelled', value: cancelledCount, cls: 'text-red-400', bg: 'bg-red-500/10' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
                <div className={`w-7 h-7 rounded-md ${s.bg} flex items-center justify-center mb-2`}><s.icon className={`w-4 h-4 ${s.cls}`} /></div>
                <p className="text-lg font-semibold leading-none">{s.value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search by invoice # or customer..." className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as OrderStatus | '')} className="px-3 py-2 text-sm rounded-lg bg-gray-800/60 border border-gray-700/60 text-white">
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PREPARING">Preparing</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="rounded-xl border border-white/10 bg-[#18191d] p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div><label className="block text-[10px] text-gray-400 mb-1">Waiter</label><CustomSelect value={waiterId ?? ''} onChange={(val) => setWaiterId(val === '' ? null : Number(val))} options={waiterOptions} placeholder="Select waiter" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">Cashier</label><CustomSelect value={cashierId ?? ''} onChange={(val) => setCashierId(val === '' ? null : Number(val))} options={cashierOptions} placeholder="Select cashier" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">Table</label><CustomSelect value={tableId ?? ''} onChange={(val) => setTableId(val === '' ? null : Number(val))} options={tableOptions} placeholder="Select table" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">Sort By</label><CustomSelect value={sortBy} onChange={(val) => setSortBy(String(val))} options={sortByOptions} /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div><label className="block text-[10px] text-gray-400 mb-1">Min Total ($)</label><input type="number" step="0.01" value={minTotal ?? ''} onChange={e => setMinTotal(e.target.value ? parseFloat(e.target.value) : null)} className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white" placeholder="0.00" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">Max Total ($)</label><input type="number" step="0.01" value={maxTotal ?? ''} onChange={e => setMaxTotal(e.target.value ? parseFloat(e.target.value) : null)} className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white" placeholder="0.00" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">Start Date</label><input type="date" value={startDate ?? ''} onChange={e => setStartDate(e.target.value || null)} className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white" /></div>
                    <div><label className="block text-[10px] text-gray-400 mb-1">End Date</label><input type="date" value={endDate ?? ''} onChange={e => setEndDate(e.target.value || null)} className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs text-white" /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={resetFilters} className="px-3 py-1.5 text-xs rounded-lg bg-gray-700/60 hover:bg-gray-700 text-white">Reset Filters</button>
                    <div className="flex gap-2">
                      <button onClick={() => setSortDirection('asc')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border ${sortDirection === 'asc' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/10 bg-black/20 text-gray-400'}`}><ArrowUp className="w-3 h-3" /> Asc</button>
                      <button onClick={() => setSortDirection('desc')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border ${sortDirection === 'desc' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/10 bg-black/20 text-gray-400'}`}><ArrowDown className="w-3 h-3" /> Desc</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orders List */}
          <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden">
            {isLoading && <div className="flex flex-col items-center justify-center h-48 gap-2"><Loader className="w-6 h-6 animate-spin text-gray-400" /><p className="text-xs text-gray-500">Loading orders…</p></div>}
            {error && <div className="flex flex-col items-center justify-center h-48 gap-2"><AlertCircle className="w-7 h-7 text-red-400" /><p className="text-sm text-red-400">Something went wrong</p><button onClick={() => refetch()} className="px-3 py-1 text-xs rounded bg-gray-700">Retry</button></div>}
            {!isLoading && !error && orders.length === 0 && (<div className="flex flex-col items-center justify-center h-48 gap-2"><div className="w-10 h-10 rounded-full bg-gray-700/60 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-gray-500" /></div><p className="text-sm text-gray-400">No orders found</p>{(debouncedSearch || statusFilter) && <p className="text-xs text-gray-600">Try adjusting your search or filters</p>}</div>)}

            {/* Table View */}
            {!isLoading && !error && orders.length > 0 && view === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-700/60">{['#', 'Invoice', 'Customer', 'Table', 'Waiter', 'Total', 'Status', 'Actions'].map(h => <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-700/40">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-700/20">
                        <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{order.id}</td>
                        <td className="px-3 py-2 text-white text-xs font-medium">{order.invoiceNumber}</td>
                        <td className="px-3 py-2 text-gray-400 text-xs">{order.customer?.name || 'Guest'}</td>
                        <td className="px-3 py-2 text-gray-400 text-xs">{order.table?.tableName || '—'}</td>
                        <td className="px-3 py-2 text-gray-400 text-xs">{order.waiter?.fullName || '—'}</td>
                        <td className="px-3 py-2 text-white text-xs font-medium">{formatCurrency(order.total)}</td>
                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                        <td className="px-3 py-2"><button onClick={() => openDetailsModal(order)} className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400"><Eye className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {!isLoading && !error && orders.length > 0 && view === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3 hover:bg-gray-800/80">
                    <div className="flex justify-between items-start mb-2"><div><span className="text-white font-mono text-xs">#{order.invoiceNumber}</span><span className="text-gray-500 text-[10px] ml-2">{formatDateTime(order.createdAt)}</span></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span></div>
                    <p className="text-white text-sm font-medium mt-2">{order.customer?.name || 'Guest'}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400"><span>Table {order.table?.tableNumber || '—'}</span><span>•</span><span>Waiter: {order.waiter?.fullName || '—'}</span></div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/60"><span className="text-white font-semibold text-sm">{formatCurrency(order.total)}</span><button onClick={() => openDetailsModal(order)} className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400"><Eye className="w-3.5 h-3.5" /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && orders.length > 0 && <PaginationControls />}
        </div>

        {/* Order Details Modal */}
        {detailsModalOpen && selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setDetailsModalOpen(false)} />}
      </div>
  );
};