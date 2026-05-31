'use client';

import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Layers, Users, ShoppingBag,
  DollarSign, Clock, Calendar, ChevronDown, Crown, Medal,
  Trophy, Wallet, Receipt, RefreshCw, AlertCircle
} from 'lucide-react';
import { useGetDashboardStats, useGetDashboardTopStats, useGetDashboardChartStats } from '@/models/dashboard/hooks';
import { useGetAllOrders } from '@/models/order/hooks';

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt     = (n: number) => `₦${n.toLocaleString()}`;
const fmtPct  = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
const today   = () => new Date().toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ── constants ─────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  COMPLETED: { badge: 'bg-emerald-500/20 text-emerald-400', label: 'DONE'      },
  PAID:      { badge: 'bg-emerald-500/20 text-emerald-400', label: 'PAID'      },
  PENDING:   { badge: 'bg-amber-500/20   text-amber-400',   label: 'PENDING'   },
  PREPARING: { badge: 'bg-blue-500/20    text-blue-400',    label: 'PREPARING' },
  CANCELLED: { badge: 'bg-red-500/20     text-red-400',     label: 'CANCELLED' },
};

const RANK_STYLES = [
  'bg-amber-500/20  text-amber-400',
  'bg-gray-500/20   text-gray-400',
  'bg-orange-500/20 text-orange-400',
];

// ── sub-components ────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-800/60 border border-gray-700/60 rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, sub, icon: Icon }: { title: string; sub?: string; icon: any }) => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/60">
    <div>
      <p className="text-sm font-medium text-white">{title}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
    <Icon className="w-4 h-4 text-gray-500" />
  </div>
);

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-700/60 rounded ${className}`} />
);

const Empty = ({ message = 'No data for this period' }: { message?: string }) => (
  <p className="px-3 py-6 text-xs text-gray-500 text-center">{message}</p>
);

const GrowthBadge = ({ value }: { value: number }) => (
  <span className={`flex items-center gap-0.5 text-xs ${value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
    {value >= 0
      ? <TrendingUp   className="w-3 h-3" />
      : <TrendingDown className="w-3 h-3" />}
    {fmtPct(value)}
  </span>
);

// ── main ──────────────────────────────────────────────────────────────────────
export const Base = () => {
  const [startDate,   setStartDate]   = useState(() => daysAgo(7));
  const [endDate,     setEndDate]     = useState(() => today());
  const [showPicker,  setShowPicker]  = useState(false);
  const [hoveredBar,  setHoveredBar]  = useState<number | null>(null);

  const params = { from: startDate, to: endDate };

  // ── data hooks ──────────────────────────────────────────────────────────────
  const {
    data: stats, isLoading: statsLoading,
    isError: statsError, refetch: refetchStats,
  } = useGetDashboardStats(params);

  const {
    data: topData, isLoading: topLoading,
    isError: topError, refetch: refetchTop,
  } = useGetDashboardTopStats({ ...params, limit: 5 });

  const {
    data: chartData, isLoading: chartLoading,
    isError: chartError, refetch: refetchChart,
  } = useGetDashboardChartStats(params);

  const {
    data: ordersData, isLoading: ordersLoading,
    isError: ordersError, refetch: refetchOrders,
  } = useGetAllOrders({
    page:          0,
    size:          8,
    search:        '',
    status:        null,
    waiterId:      null,
    cashierId:     null,
    tableId:       null,
    minTotal:      null,
    maxTotal:      null,
    startDate:     startDate,
    endDate:       endDate,
    sortBy:        'createdAt',
    sortDirection: 'desc',
  });

  const isLoading = statsLoading || topLoading || chartLoading || ordersLoading;
  const isError   = statsError   || topError   || chartError   || ordersError;
  const refetchAll = () => { refetchStats(); refetchTop(); refetchChart(); refetchOrders(); };

  // ── chart derivations ────────────────────────────────────────────────────────
  const salesByDay = chartData?.salesOverview ?? [];
  const hourly     = chartData?.revenueByHour ?? [];
  const maxRev     = salesByDay.length ? Math.max(...salesByDay.map(d => d.revenue)) : 1;
  const maxHourRev = hourly.length     ? Math.max(...hourly.map(h => h.revenue))     : 1;
  const totalRev   = salesByDay.reduce((s, d) => s + d.revenue,    0);
  const totalOrd   = salesByDay.reduce((s, d) => s + d.orderCount, 0);

  // ── recent orders ────────────────────────────────────────────────────────────
  const recentOrders = ordersData?.orders?.content ?? [];

  // ── presets ──────────────────────────────────────────────────────────────────
  const preset = (days: number) => {
    setStartDate(daysAgo(days));
    setEndDate(today());
    setShowPicker(false);
  };

  // ── loading ───────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen text-white p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Skeleton className="lg:col-span-2 h-56" />
          <Skeleton className="h-56" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-red-400">Something went wrong</p>
        <button onClick={refetchAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white p-3">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-xs text-gray-500">Track your restaurant performance</p>
          </div>

          {/* Date picker */}
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-3 h-3 text-gray-500" />
              {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()}
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {showPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
                <div className="absolute right-0 mt-1.5 w-60 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  <p className="px-3 py-2 text-sm font-medium text-gray-300 border-b border-gray-700">
                    Date range
                  </p>
                  <div className="p-3 space-y-2">
                    {(['Start', 'End'] as const).map((label) => (
                      <div key={label}>
                        <p className="text-xs text-gray-500 mb-1">{label} date</p>
                        <input
                          type="date"
                          value={label === 'Start' ? startDate : endDate}
                          onChange={e =>
                            label === 'Start'
                              ? setStartDate(e.target.value)
                              : setEndDate(e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      {[
                        { l: 'Today', d: 0  },
                        { l: 'Week',  d: 7  },
                        { l: 'Month', d: 30 },
                        { l: '3M',    d: 90 },
                      ].map(p => (
                        <button key={p.l} onClick={() => preset(p.d)}
                          className="flex-1 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                          {p.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button onClick={() => setShowPicker(false)}
                      className="w-full py-1.5 text-xs rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {
              icon: DollarSign, label: 'Total Revenue',
              value:  fmt(stats?.totalRevenue ?? 0),
              growth: stats?.revenueGrowthPercent  ?? 0,
              iconCls: 'bg-emerald-500/15 text-emerald-400',
            },
            {
              icon: ShoppingBag, label: 'Total Orders',
              value:  stats?.totalOrders ?? 0,
              growth: stats?.ordersGrowthPercent   ?? 0,
              iconCls: 'bg-blue-500/15 text-blue-400',
            },
            {
              icon: Users, label: 'Customers',
              value:  stats?.totalCustomers ?? 0,
              growth: stats?.customersGrowthPercent ?? 0,
              iconCls: 'bg-purple-500/15 text-purple-400',
            },
            {
              icon: Wallet, label: 'Avg Order',
              value:  fmt(stats?.avgOrderValue ?? 0),
              growth: stats?.avgOrderGrowthPercent  ?? 0,
              iconCls: 'bg-amber-500/15 text-amber-400',
            },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${s.iconCls}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <GrowthBadge value={s.growth} />
              </div>
              <p className="text-xl font-semibold leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

          {/* Sales overview */}
          <Card className="lg:col-span-2">
            <CardHeader title="Sales overview" sub="Daily revenue" icon={TrendingUp} />
            <div className="p-3">
              {salesByDay.length === 0 ? <Empty /> : (
                <div className="flex items-end gap-1 h-28 relative">
                  {salesByDay.map((d, i) => {
                    const h     = Math.round((d.revenue / maxRev) * 80);
                    const label = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 relative"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}>
                        {hoveredBar === i && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                            {fmt(d.revenue)}
                          </div>
                        )}
                        <div
                          className="w-full bg-blue-500 rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ height: `${h}px`, minHeight: 3 }}
                        />
                        <span className="text-xs text-gray-500">{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-gray-700/60">
                {[
                  { l: 'Total',    v: fmt(totalRev),                                       cls: 'text-white'       },
                  { l: 'Average',  v: fmt(Math.round(totalRev / (salesByDay.length || 1))), cls: 'text-white'       },
                  { l: 'Best day', v: fmt(maxRev),                                         cls: 'text-emerald-400' },
                  { l: 'Orders',   v: totalOrd,                                           cls: 'text-blue-400'    },
                ].map((c, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-gray-500">{c.l}</p>
                    <p className={`text-sm font-medium ${c.cls}`}>{c.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Revenue by hour */}
          <Card>
            <CardHeader title="Revenue by hour" sub="Busiest hours" icon={Clock} />
            <div className="p-3">
              {hourly.length === 0 ? <Empty /> : (
                <div className="space-y-2">
                  {[...hourly]
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 6)
                    .map((h, i) => {
                      const pct   = Math.round((h.revenue / maxHourRev) * 100);
                      const label = `${h.hour.toString().padStart(2, '0')}:00`;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-12 shrink-0">{label}</span>
                          <div className="flex-1 bg-gray-700/50 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-emerald-400 w-16 text-right shrink-0">
                            {fmt(h.revenue)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Top lists ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            {
              title: 'Top tables', icon: Trophy,
              items: (topData?.topTables ?? []).map(t => ({
                id:     t.tableId,
                name:   t.tableName,
                sub:    `${t.orderCount} orders`,
                right:  fmt(t.revenue),
                extra:  `${t.utilizationPercent.toFixed(0)}%`,
                growth: t.growthPercent,
              })),
            },
            {
              title: 'Top categories', icon: Layers,
              items: (topData?.topCategories ?? []).map(c => ({
                id:     c.categoryId,
                name:   c.categoryName,
                sub:    `${c.salesCount} sales`,
                right:  fmt(c.revenue),
                extra:  fmtPct(c.growthPercent),
                growth: c.growthPercent,
              })),
            },
            {
              title: 'Top items', icon: Medal,
              items: (topData?.topItems ?? []).map(item => ({
                id:     item.menuItemId,
                name:   item.menuItemName,
                sub:    item.categoryName,
                right:  fmt(item.revenue),
                extra:  fmtPct(item.growthPercent),
                growth: item.growthPercent,
              })),
            },
          ].map((col, ci) => (
            <Card key={ci}>
              <CardHeader title={col.title} icon={col.icon} />
              <div className="divide-y divide-gray-700/60">
                {col.items.length === 0 ? <Empty /> : col.items.map((item, idx) => (
                  <div key={item.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800/40 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold shrink-0 ${RANK_STYLES[idx] ?? 'bg-gray-700/50 text-gray-400'}`}>
                      {idx === 0 ? <Crown className="w-3 h-3" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-emerald-400">{item.right}</p>
                      <p className={`text-xs ${item.growth >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                        {item.extra}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* ── Recent orders table ── */}
        <Card>
          <CardHeader title="Recent orders" sub="Latest transactions" icon={Receipt} />
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? <Empty /> : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700/60">
                    {['Invoice', 'Table', 'Customer', 'Items', 'Total', 'Status', 'Time'].map(h => (
                      <th key={h}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {recentOrders.map((o) => {
                    const style = STATUS_STYLES[o.status] ?? { badge: 'bg-gray-700 text-gray-300', label: o.status };
                    return (
                      <tr key={o.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-3 py-2 font-mono text-xs text-gray-500">
                          {o.invoiceNumber}
                        </td>
                        <td className="px-3 py-2 text-[13px]">
                          {o.table?.tableName ?? <span className="text-gray-500">—</span>}
                        </td>
                        <td className="px-3 py-2 text-[13px] text-gray-300">
                          {o.customer
                            ? `${o.customer.title} ${o.customer.name}`
                            : <span className="text-gray-500">Guest</span>}
                        </td>
                        <td className="px-3 py-2 text-gray-400">
                          {o.quantity}
                        </td>
                        <td className="px-3 py-2 font-medium text-emerald-400">
                          {fmt(o.total)}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${style.badge}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-500">
                          {fmtTime(o.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 pb-1">
          Data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
        </p>

      </div>
    </div>
  );
};