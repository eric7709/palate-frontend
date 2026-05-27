'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Loader, AlertCircle, TrendingUp, Package, Layers, Users,
  ShoppingBag, DollarSign, Clock, Calendar, ChevronDown,
  Crown, Medal, Trophy, Wallet, Receipt
} from 'lucide-react';

const fetchDashboardData = async (startDate: string, endDate: string) => {
  console.log('Fetching data from:', startDate, 'to:', endDate);
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    stats: {
      totalRevenue: 25480,
      totalOrders: 342,
      totalCustomers: 128,
      averageOrderValue: 74.50,
    },
    recentOrders: [
      { id: 1, table: 'Table 1', customer: 'John Doe',     total: 45.50,  status: 'COMPLETED', time: '10:30 AM' },
      { id: 2, table: 'Table 3', customer: 'Jane Smith',   total: 78.00,  status: 'PENDING',   time: '11:15 AM' },
      { id: 3, table: 'Table 5', customer: 'Mike Johnson', total: 120.00, status: 'PREPARING', time: '11:45 AM' },
      { id: 4, table: 'Table 2', customer: 'Sarah Wilson', total: 65.50,  status: 'COMPLETED', time: '12:00 PM' },
      { id: 5, table: 'Table 4', customer: 'David Brown',  total: 95.00,  status: 'SERVED',    time: '12:30 PM' },
      { id: 6, table: 'Table 6', customer: 'Emily Davis',  total: 145.00, status: 'COMPLETED', time: '1:00 PM'  },
      { id: 7, table: 'Table 2', customer: 'Chris Wilson', total: 55.50,  status: 'PENDING',   time: '1:30 PM'  },
      { id: 8, table: 'Table 8', customer: 'Lisa Anderson',total: 88.00,  status: 'PREPARING', time: '2:00 PM'  },
    ],
    topTables: [
      { id: 1, name: 'Table 1', orders: 45, revenue: 2250, occupancy: 85 },
      { id: 2, name: 'Table 3', orders: 38, revenue: 1900, occupancy: 78 },
      { id: 3, name: 'Table 5', orders: 32, revenue: 1600, occupancy: 72 },
      { id: 4, name: 'Table 2', orders: 28, revenue: 1400, occupancy: 68 },
      { id: 5, name: 'Table 4', orders: 25, revenue: 1250, occupancy: 65 },
    ],
    topCategories: [
      { id: 1, name: 'Main Course', sales: 128, revenue: 3840, growth: 15 },
      { id: 2, name: 'Appetizers',  sales: 95,  revenue: 1425, growth: 12 },
      { id: 3, name: 'Beverages',   sales: 87,  revenue: 870,  growth: 18 },
      { id: 4, name: 'Desserts',    sales: 62,  revenue: 930,  growth: 8  },
      { id: 5, name: 'Salads',      sales: 45,  revenue: 675,  growth: 10 },
    ],
    topMenuItems: [
      { id: 1, name: 'Grilled Salmon',   category: 'Main Course', sales: 45, revenue: 1125, growth: 12 },
      { id: 2, name: 'Caesar Salad',     category: 'Salads',      sales: 38, revenue: 570,  growth: 8  },
      { id: 3, name: 'Beef Burger',      category: 'Main Course', sales: 32, revenue: 640,  growth: 15 },
      { id: 4, name: 'Pasta Carbonara',  category: 'Main Course', sales: 28, revenue: 560,  growth: 5  },
      { id: 5, name: 'Chicken Wings',    category: 'Appetizers',  sales: 25, revenue: 375,  growth: 10 },
    ],
    salesByDay: [
      { day: 'Mon', revenue: 1250, orders: 18 },
      { day: 'Tue', revenue: 1480, orders: 22 },
      { day: 'Wed', revenue: 1620, orders: 24 },
      { day: 'Thu', revenue: 1890, orders: 28 },
      { day: 'Fri', revenue: 2150, orders: 32 },
      { day: 'Sat', revenue: 2780, orders: 42 },
      { day: 'Sun', revenue: 2420, orders: 36 },
    ],
  };
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  PENDING:   'bg-amber-100 text-amber-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  SERVED:    'bg-purple-100 text-purple-800',
};

const RANK_STYLES = [
  'bg-amber-100 text-amber-800',
  'bg-gray-200 text-gray-700',
  'bg-orange-100 text-orange-800',
];

export const Base = () => {
  const [data, setData]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  const [showPicker, setShowPicker]   = useState(false);
  const [hoveredBar, setHoveredBar]   = useState<number | null>(null);

  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  useEffect(() => { load(); }, [startDate, endDate]);

  const load = async () => {
    setLoading(true);
    try {
      setData(await fetchDashboardData(startDate, endDate));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const preset = (days: number) => {
    const end = new Date(), start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setShowPicker(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-7 h-7 animate-spin text-gray-400" />
        <p className="text-xs text-gray-400">Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-red-400">Something went wrong</p>
        <button onClick={load} className="px-3 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600">
          Retry
        </button>
      </div>
    </div>
  );

  const maxRev = Math.max(...data.salesByDay.map((d: any) => d.revenue));
  const totalRev = data.salesByDay.reduce((s: number, d: any) => s + d.revenue, 0);
  const totalOrd = data.salesByDay.reduce((s: number, d: any) => s + d.orders, 0);
  const fmt = (n: number) => n.toLocaleString();

  /* ── Shared card shell ── */
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
                  <p className="px-3 py-2 text-sm font-medium text-gray-300 border-b border-gray-700">Date range</p>
                  <div className="p-3 space-y-2">
                    {(['Start', 'End'] as const).map((label) => (
                      <div key={label}>
                        <p className="text-xs text-gray-500 mb-1">{label} date</p>
                        <input
                          type="date"
                          value={label === 'Start' ? startDate : endDate}
                          onChange={e => label === 'Start' ? setStartDate(e.target.value) : setEndDate(e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      {[{ l: 'Today', d: 0 }, { l: 'Week', d: 7 }, { l: 'Month', d: 30 }, { l: '3M', d: 90 }].map(p => (
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
            { icon: DollarSign, label: 'Total Revenue',  value: `$${fmt(data.stats.totalRevenue)}`,    change: '+12.5%', iconCls: 'bg-emerald-500/15 text-emerald-400' },
            { icon: ShoppingBag,label: 'Total Orders',   value: data.stats.totalOrders,                change: '+8.2%',  iconCls: 'bg-blue-500/15 text-blue-400'    },
            { icon: Users,       label: 'Customers',     value: data.stats.totalCustomers,             change: '+15.3%', iconCls: 'bg-purple-500/15 text-purple-400' },
            { icon: Wallet,      label: 'Avg Order',     value: `$${data.stats.averageOrderValue}`,    change: '+5.2%',  iconCls: 'bg-amber-500/15 text-amber-400'  },
          ].map((s, i) => (
            <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${s.iconCls}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="flex items-center gap-0.5 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" />{s.change}
                </span>
              </div>
              <p className="text-xl font-semibold leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Live orders ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Bar chart */}
          <Card className="lg:col-span-2">
            <CardHeader title="Sales overview" sub="Daily revenue" icon={TrendingUp} />
            <div className="p-3">
              <div className="flex items-end gap-1 h-28 relative">
                {data.salesByDay.map((d: any, i: number) => {
                  const h = Math.round((d.revenue / maxRev) * 80);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 relative group"
                      onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                      {hoveredBar === i && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                          ${fmt(d.revenue)}
                        </div>
                      )}
                      <div className="w-full bg-blue-500 rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${h}px`, minHeight: 3 }} />
                      <span className="text-xs text-gray-500">{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-gray-700/60">
                {[
                  { l: 'Total',    v: `$${fmt(totalRev)}`,                        cls: 'text-white'        },
                  { l: 'Average',  v: `$${fmt(Math.round(totalRev / 7))}`,        cls: 'text-white'        },
                  { l: 'Best day', v: `$${fmt(maxRev)}`,                          cls: 'text-emerald-400'  },
                  { l: 'Orders',   v: totalOrd,                                    cls: 'text-blue-400'     },
                ].map((c, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-gray-500">{c.l}</p>
                    <p className={`text-sm font-medium ${c.cls}`}>{c.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Live orders */}
          <Card>
            <CardHeader title="Live orders" icon={Clock} />
            <div className="divide-y divide-gray-700/60">
              {data.recentOrders.slice(0, 5).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-[13px] font-medium">{o.table} · {o.customer}</p>
                    <p className="text-xs text-gray-500">{o.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-400">${o.total}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[o.status] ?? 'bg-gray-700 text-gray-300'}`}>
                      {o.status === 'COMPLETED' ? 'DONE' : o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Top 3 rank lists ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { title: 'Top tables',     icon: Trophy,  items: data.topTables,     sub: (x: any) => `${x.orders} orders`,  right: (x: any) => `$${fmt(x.revenue)}`, extra: (x: any) => x.occupancy + '%' },
            { title: 'Top categories', icon: Layers,  items: data.topCategories, sub: (x: any) => `${x.sales} sales`,   right: (x: any) => `$${fmt(x.revenue)}`, extra: (x: any) => `+${x.growth}%`  },
            { title: 'Top items',      icon: Medal,   items: data.topMenuItems,  sub: (x: any) => x.category,            right: (x: any) => `$${fmt(x.revenue)}`, extra: (x: any) => `+${x.growth}%`  },
          ].map((col, ci) => (
            <Card key={ci}>
              <CardHeader title={col.title} icon={col.icon} />
              <div className="divide-y divide-gray-700/60">
                {col.items.map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800/40 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-sm font-semibold shrink-0 ${RANK_STYLES[idx] ?? 'bg-gray-700 text-gray-400'}`}>
                      {idx === 0 ? <Crown className="w-3 h-3" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{col.sub(item)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-emerald-400">{col.right(item)}</p>
                      <p className="text-xs text-emerald-500">{col.extra(item)}</p>
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
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700/60">
                  {['#', 'Table', 'Customer', 'Total', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/40">
                {data.recentOrders.map((o: any, i: number) => (
                  <tr key={o.id} className="hover:bg-gray-800/30 text-[13px] transition-colors">
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">#{o.id}</td>
                    <td className="px-3 py-2">{o.table}</td>
                    <td className="px-3 py-2 text-gray-300">{o.customer}</td>
                    <td className="px-3 py-2 font-medium text-emerald-400">${o.total}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[o.status] ?? 'bg-gray-700 text-gray-300'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500">{o.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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