"use client";

import { useState } from "react";
import DateDropdown from "@/ui/DateDropdown";
import { useAnalyticsStore } from "@/models/analytics/store";
import { useGetAnalyticsSummary } from "@/models/analytics/hooks";
import {
  AccountSalesDTO,
  CategorySalesDTO,
  MenuItemSalesDTO,
  CustomerSalesDTO,
  TableSalesDTO,
  HourSalesDTO,
  DaySalesDTO,
} from "@/models/analytics/types";

// ─── helpers ────────────────────────────────────────────────────────────────

const currency = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const pct = (n: number) => `${n.toFixed(1)}%`;

const rankIcon = (idx: number) => {
  if (idx === 0) return "🥇";
  if (idx === 1) return "🥈";
  if (idx === 2) return "🥉";
  return null;
};

// ─── stat card (blue theme) ────────────────────────────────────────────────
function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: string }) {
  return (
    <div className="group relative bg-blue-500/5 border border-blue-500/30 rounded-2xl p-5 transition-all duration-200 hover:border-indigo-500/50 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-2 tracking-tight">{value}</p>
          {sub && <p className="text-[11px] text-gray-500 mt-1">{sub}</p>}
        </div>
        {icon && <span className="text-xl opacity-40 group-hover:opacity-80 transition-opacity">{icon}</span>}
      </div>
    </div>
  );
}

// ─── rank list (unchanged but uses blue pill variants) ─────────────────────
function RankList<T>({
  items,
  getKey,
  getName,
  getValue,
  getSub,
  accent = "indigo",
}: {
  items: T[];
  getKey: (item: T) => number;
  getName: (item: T) => string;
  getValue: (item: T) => string;
  getSub?: (item: T) => string;
  accent?: string;
}) {
  const accentMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    teal: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  };
  const pillClass = accentMap[accent] ?? accentMap.indigo;

  if (!items?.length)
    return <p className="text-[12px] text-gray-600 py-6 text-center italic">No data</p>;

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, i) => (
        <li
          key={getKey(item)}
          className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all duration-150"
        >
          <div className="w-6 shrink-0 text-center">
            {rankIcon(i) ? (
              <span className="text-sm">{rankIcon(i)}</span>
            ) : (
              <span className="text-[11px] font-mono text-gray-600">{i + 1}</span>
            )}
          </div>
          <span className="flex-1 text-[13px] font-medium text-gray-200 truncate">{getName(item)}</span>
          {getSub && <span className="text-[11px] text-gray-500 shrink-0 hidden sm:block">{getSub(item)}</span>}
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${pillClass}`}>
            {getValue(item)}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── section wrapper (blue theme) ──────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-blue-500/5 border border-blue-500/30 rounded-2xl p-4 transition-all hover:border-indigo-500/50 h-full flex flex-col">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        {title}
      </p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── hour bar (indigo bar) ──────────────────────────────────────────────────
function HourBar({ hour, count, max }: { hour: number; count: number; max: number }) {
  const h = hour % 12 || 12;
  const label = `${h}${hour < 12 ? "am" : "pm"}`;
  const width = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2 group">
      <span className="text-[11px] font-mono text-gray-400 w-8 text-right shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 group-hover:brightness-110"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[11px] text-gray-400 w-6 shrink-0 text-right">{count}</span>
    </div>
  );
}

// ─── day row (amber bar) ────────────────────────────────────────────────────
function DayRow({ day, sales, maxSales }: { day: string; sales: number; maxSales: number }) {
  const width = maxSales > 0 ? (sales / maxSales) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2 group">
      <span className="text-[11px] font-mono text-gray-400 w-16 text-right shrink-0">{day}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500/70 transition-all duration-300 group-hover:brightness-110"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[11px] text-gray-400 w-20 shrink-0 text-right">{currency(sales)}</span>
    </div>
  );
}

// ─── presets ────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

const PRESETS = [
  { label: "Today", from: () => today(), to: () => today() },
  { label: "7 days", from: () => daysAgo(6), to: () => today() },
  { label: "30 days", from: () => daysAgo(29), to: () => today() },
  { label: "90 days", from: () => daysAgo(89), to: () => today() },
];

// ─── main dashboard (blue theme) ───────────────────────────────────────────
export default function AnalyticsDashboard() {
  const { params, setDateRange } = useAnalyticsStore();
  const { data, isLoading, isError } = useGetAnalyticsSummary(params);
  const [activePreset, setActivePreset] = useState<string | null>("30 days");

  const handlePreset = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.label);
    setDateRange(preset.from(), preset.to());
  };

  const handleDatePick = (key: "from" | "to") => (date: string) => {
    setActivePreset(null);
    setDateRange(
      key === "from" ? date : params.from,
      key === "to" ? date : params.to
    );
  };

  const maxHour = data?.salesByHour?.reduce((m, h) => Math.max(m, h.orderCount), 0) ?? 1;
  const maxDaySales = data?.salesByDay?.reduce((m, d) => Math.max(m, d.totalSales), 0) ?? 1;

  return (
    <div className="min-h-screen  text-white">
      {/* redesigned header */}
      <div className="relative flex p-5 flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-blue-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-transparent tracking-tight">
              Analytics
            </h1>
            <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              LIVE
            </span>
          </div>
          <p className="text-[12px] text-gray-400">Restaurant performance · deep insights</p>
          {params.from && params.to && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
              <span>{params.from} → {params.to}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-blue-500/10 rounded-full border border-blue-500/30 p-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activePreset === p.label
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-blue-500/10 rounded-full px-2 py-1 border border-blue-500/30">
            <DateDropdown
              placeholder="From"
              selected={params.from || null}
              onSelect={handleDatePick("from")}
            />
            <span className="text-gray-500 text-xs">→</span>
            <DateDropdown
              placeholder="To"
              selected={params.to || null}
              onSelect={handleDatePick("to")}
            />
          </div>
        </div>
      </div>

      {/* loading & error */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading insights...</p>
        </div>
      )}

      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-sm text-rose-400 backdrop-blur-sm">
          ⚠️ Failed to load analytics. Adjust your date range and try again.
        </div>
      )}

      {data && (
        <div className="p-5 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="TOTAL REVENUE" value={currency(data.totalRevenue)} icon="💰" />
            <StatCard label="TOTAL ORDERS" value={data.totalOrders.toLocaleString()} icon="📦" />
            <StatCard
              label="AVG ORDER VALUE"
              value={currency(data.averageOrderValue)}
              sub={`${data.averageItemsPerOrder?.toFixed(1)} items/order`}
              icon="🧾"
            />
            <StatCard
              label="CANCELLATION RATE"
              value={pct(data.cancellationRate)}
              sub={`${data.cancelledOrders} cancelled`}
              icon="⚠️"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="NEW CUSTOMERS" value={data.newCustomers?.toLocaleString() ?? "—"} icon="✨" />
            <StatCard label="RETURNING" value={data.returningCustomers?.toLocaleString() ?? "—"} icon="🔄" />
            <StatCard
              label="DINE-IN"
              value={data.dineInCount?.toLocaleString() ?? "—"}
              sub={currency(data.dineInRevenue)}
              icon="🍽️"
            />
            <StatCard
              label="TAKE-OUT"
              value={data.takeOutCount?.toLocaleString() ?? "—"}
              sub={currency(data.takeOutRevenue)}
              icon="🥡"
            />
          </div>

          {/* Top performers by sales */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-1 rounded-full bg-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">🏆 Top performers — by sales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Section title="Waiters">
                <RankList<AccountSalesDTO>
                  items={data.topWaitersBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  getSub={(i) => `${i.orderCount} orders`}
                />
              </Section>
              <Section title="Cashiers">
                <RankList<AccountSalesDTO>
                  items={data.topCashiersBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  getSub={(i) => `${i.orderCount} orders`}
                />
              </Section>
              <Section title="Tables">
                <RankList<TableSalesDTO>
                  items={data.topTablesBySales}
                  getKey={(i) => i.id}
                  getName={(i) => `Table ${i.tableNumber} · ${i.tableName}`}
                  getValue={(i) => currency(i.totalSales)}
                  getSub={(i) => `${i.orderCount} orders`}
                  accent="teal"
                />
              </Section>
              <Section title="Categories">
                <ul className="flex flex-col gap-1">
                  {data.topCategoriesBySales?.map((cat: CategorySalesDTO, i: number) => (
                    <li
                      key={cat.id}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all duration-150"
                    >
                      <div className="w-6 shrink-0 text-center">
                        {rankIcon(i) ? (
                          <span className="text-sm">{rankIcon(i)}</span>
                        ) : (
                          <span className="text-[11px] font-mono text-gray-600">{i + 1}</span>
                        )}
                      </div>
                      <span className="flex-1 text-[13px] font-medium text-gray-200 truncate">{cat.name}</span>
                      <div className="shrink-0 text-right">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/20">
                          {currency(cat.totalSales)}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-0.5">{cat.totalQuantity} items</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="Menu items">
                <RankList<MenuItemSalesDTO>
                  items={data.topMenuItemsBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  accent="amber"
                />
              </Section>
              <Section title="Customers">
                <RankList<CustomerSalesDTO>
                  items={data.topCustomersBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  getSub={(i) => i.phoneNumber ?? ""}
                />
              </Section>
            </div>
          </div>

          {/* Top performers by volume */}
          <div>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <div className="h-5 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">📊 Top performers — by volume</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Section title="Waiters (orders)">
                <RankList<AccountSalesDTO>
                  items={data.topWaitersByCount}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.orderCount} orders`}
                />
              </Section>
              <Section title="Cashiers (orders)">
                <RankList<AccountSalesDTO>
                  items={data.topCashiersByCount}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.orderCount} orders`}
                />
              </Section>
              <Section title="Menu items (qty)">
                <RankList<MenuItemSalesDTO>
                  items={data.topMenuItemsByCount}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.totalQuantity} sold`}
                  accent="amber"
                />
              </Section>
              <Section title="Tables (orders)">
                <RankList<TableSalesDTO>
                  items={data.topTablesByCount}
                  getKey={(i) => i.id}
                  getName={(i) => `Table ${i.tableNumber} · ${i.tableName}`}
                  getValue={(i) => `${i.orderCount} orders`}
                  accent="teal"
                />
              </Section>
              <Section title="Categories (items)">
                <RankList<CategorySalesDTO>
                  items={data.topCategoriesByCount}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.totalQuantity} items`}
                  accent="amber"
                />
              </Section>
              <Section title="Most frequent customers">
                <RankList<CustomerSalesDTO>
                  items={data.topCustomersByFrequency}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.orderCount} visits`}
                  getSub={(i) => i.phoneNumber ?? ""}
                />
              </Section>
            </div>
          </div>

          {/* Underperformers */}
          <div>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <div className="h-5 w-1 rounded-full bg-rose-500" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">⚠️ Underperformers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Section title="Waiters (sales)">
                <RankList<AccountSalesDTO>
                  items={data.leastWaitersBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  getSub={(i) => `${i.orderCount} orders`}
                  accent="rose"
                />
              </Section>
              <Section title="Cashiers (sales)">
                <RankList<AccountSalesDTO>
                  items={data.leastCashiersBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  accent="rose"
                />
              </Section>
              <Section title="Menu items (sales)">
                <RankList<MenuItemSalesDTO>
                  items={data.leastMenuItemsBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  accent="rose"
                />
              </Section>
              <Section title="Tables (sales)">
                <RankList<TableSalesDTO>
                  items={data.leastTablesBySales}
                  getKey={(i) => i.id}
                  getName={(i) => `Table ${i.tableNumber} · ${i.tableName}`}
                  getValue={(i) => currency(i.totalSales)}
                  accent="rose"
                />
              </Section>
              <Section title="Categories (sales)">
                <RankList<CategorySalesDTO>
                  items={data.leastCategoriesBySales}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => currency(i.totalSales)}
                  accent="rose"
                />
              </Section>
              <Section title="Waiters (by orders)">
                <RankList<AccountSalesDTO>
                  items={data.leastWaitersByCount}
                  getKey={(i) => i.id}
                  getName={(i) => i.name}
                  getValue={(i) => `${i.orderCount} orders`}
                  accent="rose"
                />
              </Section>
            </div>
          </div>

          {/* Time insights */}
          <div>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <div className="h-5 w-1 rounded-full bg-cyan-500" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">⏱️ Time intelligence</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <Section title="Sales by day of week">
                <div className="space-y-0">
                  {data.salesByDay?.map((d: DaySalesDTO) => (
                    <DayRow
                      key={d.dayName}
                      day={d.dayName}
                      sales={d.totalSales}
                      maxSales={maxDaySales}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Peak hours (order volume)">
                <div className="space-y-0">
                  {[...(data.salesByHour ?? [])]
                    .sort((a, b) => b.orderCount - a.orderCount)
                    .slice(0, 12)
                    .map((h: HourSalesDTO) => (
                      <HourBar key={h.hour} hour={h.hour} count={h.orderCount} max={maxHour} />
                    ))}
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}