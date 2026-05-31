"use client";

import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  TrendingUp, ShoppingBag, Users, Clock, Table2,
  ChefHat, CreditCard, BarChart2, AlertCircle,
} from "lucide-react";
import {
  useRevenueSummary, useRevenueOverTime, useOrdersByStatus,
  usePeakHours, useTopItems, useLeastItems, useCancelledItems,
  useCustomerSummary, useTopCustomers, useOrdersPerWaiter,
  useRevenuePerCashier, useTableActivity,
} from "@/models/analytics/hooks";
import {
  useAnalyticsFilterStore,
  type AnalyticsPreset,
} from "@/models/analytics/store.filter";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0d0f12",
  surface:   "#13161b",
  border:    "#1e2229",
  muted:     "#2a2f3a",
  text:      "#e8eaf0",
  sub:       "#7a8394",
  accent:    "#f0b429",
  accentDim: "#f0b42920",
  green:     "#34d399",
  red:       "#f87171",
  blue:      "#60a5fa",
  purple:    "#a78bfa",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:   C.accent,
  PREPARING: C.blue,
  COMPLETED: C.green,
  PAID:      "#10b981",
  CANCELLED: C.red,
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <Icon size={16} color={C.accent} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.sub, textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function Skeleton({ h = 200 }: { h?: number }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: 12,
        background: `linear-gradient(90deg, ${C.muted} 25%, #333844 50%, ${C.muted} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function Empty() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: C.sub, fontSize: 13 }}>
      No data for this period
    </div>
  );
}

function Fmt({ v, prefix = "" }: { v?: number | null; prefix?: string }) {
  if (v == null) return <span style={{ color: C.sub }}>—</span>;
  return <>{prefix}{v.toLocaleString("en-NG", { maximumFractionDigits: 0 })}</>;
}

// ─── Date range picker ────────────────────────────────────────────────────────

const PRESETS: { label: string; value: Exclude<AnalyticsPreset, "custom"> }[] = [
  { label: "Today",     value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "7 days",    value: "7d" },
  { label: "30 days",   value: "30d" },
  { label: "90 days",   value: "90d" },
];

function DateRangePicker() {
  const { preset, startDate, endDate, setPreset, setCustomRange } = useAnalyticsFilterStore();
  const [customStart, setCustomStart] = useState(startDate.slice(0, 10));
  const [customEnd,   setCustomEnd]   = useState(endDate.slice(0, 10));

  const applyCustom = () => {
    if (customStart && customEnd) {
      setCustomRange(
        new Date(customStart + "T00:00:00").toISOString(),
        new Date(customEnd   + "T23:59:59").toISOString(),
      );
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {PRESETS.map((p) => (
        <button
          key={p.value}
          onClick={() => setPreset(p.value)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${preset === p.value ? C.accent : C.border}`,
            background: preset === p.value ? C.accentDim : "transparent",
            color: preset === p.value ? C.accent : C.sub,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {p.label}
        </button>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
        <input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          style={inputStyle}
        />
        <span style={{ color: C.sub, fontSize: 12 }}>→</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          style={inputStyle}
        />
        <button onClick={applyCustom} style={applyBtnStyle}>Apply</button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  fontSize: 12,
  padding: "5px 10px",
  outline: "none",
};

const applyBtnStyle: React.CSSProperties = {
  background: C.accent,
  color: "#0d0f12",
  border: "none",
  borderRadius: 8,
  padding: "6px 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

// ─── Revenue section ──────────────────────────────────────────────────────────

function RevenueSummaryCards() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useRevenueSummary({ startDate, endDate });

  const stats = [
    { label: "Total Revenue",   value: data?.totalRevenue,  prefix: "₦", color: C.green },
    { label: "Avg Order Value", value: data?.avgOrderValue, prefix: "₦", color: C.accent },
    { label: "Total Orders",    value: data?.totalOrders,   prefix: "",  color: C.blue },
  ];

  return (
    <>
      {stats.map((s) => (
        <Card key={s.label}>
          {isLoading ? (
            <Skeleton h={60} />
          ) : (
            <>
              <p style={{ fontSize: 11, color: C.sub, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>
                <Fmt v={s.value} prefix={s.prefix} />
              </p>
            </>
          )}
        </Card>
      ))}
    </>
  );
}

function RevenueOverTimeChart() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useRevenueOverTime({ startDate, endDate });

  return (
    <Card>
      <SectionTitle icon={TrendingUp} label="Revenue over time" />
      {isLoading ? <Skeleton /> : !data?.length ? <Empty /> : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="period"
              tickFormatter={(v) => { try { return format(parseISO(v), "MMM d"); } catch { return v; } }}
              tick={{ fill: C.sub, fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              tick={{ fill: C.sub, fontSize: 11 }}
              axisLine={false} tickLine={false} width={52}
            />
            <Tooltip
              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}
              labelFormatter={(v) => { try { return format(parseISO(String(v)), "MMM d, yyyy"); } catch { return v; } }}
              formatter={(v) => [`₦${Number(v).toLocaleString()}`, "Revenue"]}
            />
            <Line dataKey="revenue" stroke={C.accent} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.accent }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ─── Orders section ───────────────────────────────────────────────────────────

function OrdersByStatusChart() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useOrdersByStatus({ startDate, endDate });

  return (
    <Card>
      <SectionTitle icon={ShoppingBag} label="Orders by status" />
      {isLoading ? <Skeleton /> : !data?.length ? <Empty /> : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? C.muted} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}
              formatter={(v, name) => [Number(v).toLocaleString(), String(name)]}
            />
            <Legend
              iconType="circle" iconSize={8}
              formatter={(v) => <span style={{ color: C.sub, fontSize: 11 }}>{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

function PeakHoursChart() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = usePeakHours({ startDate, endDate });

  const formatted = data?.map((d) => ({
    ...d,
    label: `${String(d.hour).padStart(2, "0")}:00`,
  }));

  return (
    <Card>
      <SectionTitle icon={Clock} label="Peak hours" />
      {isLoading ? <Skeleton /> : !formatted?.length ? <Empty /> : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formatted} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: C.sub, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.sub, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}
              cursor={{ fill: C.accentDim }}
            />
            <Bar dataKey="count" fill={C.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ─── Menu section ─────────────────────────────────────────────────────────────

type RankItem = { itemName: string; totalQuantity: number; totalRevenue?: number; cancelCount?: number };

function ItemRankList({
  title, icon, data, isLoading, valueKey, valuePrefix = "", valueColor = C.text,
}: {
  title: string;
  icon: React.ElementType;
  data?: RankItem[];
  isLoading: boolean;
  valueKey: keyof RankItem;
  valuePrefix?: string;
  valueColor?: string;
}) {
  return (
    <Card>
      <SectionTitle icon={icon} label={title} />
      {isLoading ? <Skeleton h={180} /> : !data?.length ? <Empty /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((item, i) => (
            <div key={item.itemName as string} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: C.sub, width: 18, textAlign: "right", flexShrink: 0 }}>
                {i + 1}
              </span>
              <div style={{
                flex: 1, height: 32, background: C.muted, borderRadius: 6,
                display: "flex", alignItems: "center", padding: "0 12px",
                overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${Math.round(((item[valueKey] as number) / (data[0][valueKey] as number)) * 100)}%`,
                  background: `${valueColor}18`,
                  borderRadius: 6,
                }} />
                <span style={{ fontSize: 12, color: C.text, zIndex: 1, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.itemName as string}
                </span>
                <span style={{ fontSize: 12, color: valueColor, fontWeight: 600, zIndex: 1, flexShrink: 0 }}>
                  {valuePrefix}<Fmt v={item[valueKey] as number} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function MenuSection() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data: topData,       isLoading: topLoading }       = useTopItems({ startDate, endDate });
  const { data: leastData,     isLoading: leastLoading }     = useLeastItems({ startDate, endDate });
  const { data: cancelledData, isLoading: cancelledLoading } = useCancelledItems({ startDate, endDate });

  return (
    <>
      <ItemRankList
        title="Top selling items"
        icon={BarChart2}
        data={topData}
        isLoading={topLoading}
        valueKey="totalQuantity"
        valueColor={C.green}
      />
      <ItemRankList
        title="Least selling items"
        icon={BarChart2}
        data={leastData}
        isLoading={leastLoading}
        valueKey="totalQuantity"
        valueColor={C.accent}
      />
      <ItemRankList
        title="Most cancelled items"
        icon={AlertCircle}
        data={cancelledData?.map((d) => ({ itemId: d.itemId, itemName: d.itemName, totalQuantity: d.cancelCount }))}
        isLoading={cancelledLoading}
        valueKey="totalQuantity"
        valueColor={C.red}
      />
    </>
  );
}

// ─── Customers section ────────────────────────────────────────────────────────

function CustomerSummaryCard() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useCustomerSummary({ startDate, endDate });

  const total = (data?.newCustomers ?? 0) + (data?.returningCustomers ?? 0);
  const newPct = total ? Math.round(((data?.newCustomers ?? 0) / total) * 100) : 0;

  return (
    <Card>
      <SectionTitle icon={Users} label="New vs returning customers" />
      {isLoading ? <Skeleton h={100} /> : !data ? <Empty /> : (
        <>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>New</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{data.newCustomers.toLocaleString()}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>Returning</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{data.returningCustomers.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: C.muted, overflow: "hidden" }}>
            <div style={{ width: `${newPct}%`, height: "100%", background: C.green, borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: C.green }}>{newPct}% new</span>
            <span style={{ fontSize: 11, color: C.blue }}>{100 - newPct}% returning</span>
          </div>
        </>
      )}
    </Card>
  );
}

function TopCustomersTable() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useTopCustomers({ startDate, endDate });

  return (
    <Card>
      <SectionTitle icon={Users} label="Top customers" />
      {isLoading ? <Skeleton h={180} /> : !data?.length ? <Empty /> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Customer", "Orders", "Total Spent"].map((h) => (
                <th key={h} style={{ textAlign: "left", color: C.sub, fontWeight: 600, paddingBottom: 10, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.customerId} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 0", color: C.text }}>{c.customerName}</td>
                <td style={{ padding: "10px 0", color: C.sub }}>{c.orderCount}</td>
                <td style={{ padding: "10px 0", color: C.green, fontWeight: 600 }}>₦{c.totalSpent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

// ─── Staff section ────────────────────────────────────────────────────────────

function StaffTable({
  title, icon, data, isLoading, valueLabel, valueKey, valueColor,
}: {
  title: string;
  icon: React.ElementType;
  data?: { staffId: number; staffName: string; orderCount: number; totalValue: number }[];
  isLoading: boolean;
  valueLabel: string;
  valueKey: "orderCount" | "totalValue";
  valueColor: string;
}) {
  return (
    <Card>
      <SectionTitle icon={icon} label={title} />
      {isLoading ? <Skeleton h={160} /> : !data?.length ? <Empty /> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Name", "Orders", valueLabel].map((h) => (
                <th key={h} style={{ textAlign: "left", color: C.sub, fontWeight: 600, paddingBottom: 10, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.staffId} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 0", color: C.text }}>{s.staffName}</td>
                <td style={{ padding: "10px 0", color: C.sub }}>{s.orderCount}</td>
                <td style={{ padding: "10px 0", color: valueColor, fontWeight: 600 }}>
                  {valueKey === "totalValue" ? "₦" : ""}<Fmt v={s[valueKey]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function StaffSection() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data: waiterData,  isLoading: waiterLoading }  = useOrdersPerWaiter({ startDate, endDate });
  const { data: cashierData, isLoading: cashierLoading } = useRevenuePerCashier({ startDate, endDate });

  return (
    <>
      <StaffTable
        title="Orders per waiter"
        icon={ChefHat}
        data={waiterData}
        isLoading={waiterLoading}
        valueLabel="Orders"
        valueKey="orderCount"
        valueColor={C.blue}
      />
      <StaffTable
        title="Revenue per cashier"
        icon={CreditCard}
        data={cashierData}
        isLoading={cashierLoading}
        valueLabel="Revenue"
        valueKey="totalValue"
        valueColor={C.green}
      />
    </>
  );
}

// ─── Tables section ───────────────────────────────────────────────────────────

function TableActivityChart() {
  const { startDate, endDate } = useAnalyticsFilterStore();
  const { data, isLoading } = useTableActivity({ startDate, endDate });

  const formatted = data?.map((t) => ({
    name: t.tableName || `T${t.tableNumber}`,
    orders: t.orderCount,
    revenue: t.totalRevenue,
  }));

  return (
    <Card>
      <SectionTitle icon={Table2} label="Table activity" />
      {isLoading ? <Skeleton /> : !formatted?.length ? <Empty /> : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="4 4" horizontal={false} />
            <XAxis type="number" tick={{ fill: C.sub, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: C.sub, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}
              cursor={{ fill: C.accentDim }}
            />
            <Bar dataKey="orders" fill={C.purple} radius={[0, 4, 4, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: C.sub, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        {label}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

// ─── Base ─────────────────────────────────────────────────────────────────────

export default function AnalyticsBase() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2f3a; border-radius: 99px; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 40 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 4 }}>Analytics</h1>
            <p style={{ fontSize: 13, color: C.sub }}>Track revenue, orders, menu performance, and more</p>
          </div>
          <DateRangePicker />
        </div>

        {/* Revenue */}
        <Section label="Revenue">
          <RevenueSummaryCards />
        </Section>
        <Section label="">
          <div style={{ gridColumn: "1 / -1" }}>
            <RevenueOverTimeChart />
          </div>
        </Section>

        {/* Orders */}
        <Section label="Orders">
          <OrdersByStatusChart />
          <PeakHoursChart />
        </Section>

        {/* Menu */}
        <Section label="Menu performance">
          <MenuSection />
        </Section>

        {/* Customers */}
        <Section label="Customers">
          <CustomerSummaryCard />
          <div style={{ gridColumn: "span 2" }}>
            <TopCustomersTable />
          </div>
        </Section>

        {/* Staff */}
        <Section label="Staff">
          <StaffSection />
        </Section>

        {/* Tables */}
        <Section label="Tables">
          <div style={{ gridColumn: "1 / -1" }}>
            <TableActivityChart />
          </div>
        </Section>

      </div>
    </div>
  );
}