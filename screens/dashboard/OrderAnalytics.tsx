"use client";

import { useGetDashboardStats } from "@/models/dashboard/hooks";
import Loader from "@/ui/Loader";
import {
    AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const DOUGHNUT_COLORS = ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444", "#06B6D4"];

const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "rgba(15,12,30,0.92)", border: "0.5px solid rgba(167,139,250,0.3)", borderRadius: 12, backdropFilter: "blur(8px)", padding: "10px" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#c4b5fd", margin: 0 }}>
                {payload[0].value} <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>orders</span>
            </p>
        </div>
    );
};

const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "rgba(15,12,30,0.92)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{payload[0].name}</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>₦{payload[0].value.toFixed(2)}</p>
        </div>
    );
};

export default function OrderAnalytics() {
    const { data, isLoading, error } = useGetDashboardStats();

    

    if (isLoading) return <Loader />;
    if (error || !data) return <div className="text-white p-5">Failed to load analytics</div>;

    const { hourlyVolume, tableAverages, totalOrdersToday, peakHour } = data;

    const topTable = tableAverages.length > 0 
        ? tableAverages.reduce((a, b) => (b.value > a.value ? b : a)) 
        : { tableName: "N/A", value: 0 };
    console.log(hourlyVolume, "TOP Table")
    
    const portfolioAvg = tableAverages.length > 0 
        ? tableAverages.reduce((a, b) => a + b.value, 0) / tableAverages.length 
        : 0;

    const metrics = [
        { label: "Peak Hour", value: peakHour.time, sub: `${peakHour.count} orders` },
        { label: "Daily Total", value: totalOrdersToday.toLocaleString(), sub: "orders today" },
        { label: "Top Table", value: `₦${topTable.value.toLocaleString()}`, sub: `${topTable.tableName} - ₦${topTable.value.toFixed(2)} avg` },
        { label: "Portfolio Avg", value: `₦${portfolioAvg.toFixed(2)}`, sub: "across all tables" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, index) => {
                    const colors = ["from-amber-500/20", "from-blue-500/20", "from-purple-500/20", "from-emerald-500/20"];
                    const borderColor = ["border-amber-500/30", "border-blue-500/30", "border-purple-500/30", "border-emerald-500/30"];
                    return (
                        <div key={m.label} className={`relative overflow-hidden group bg-linear-to-br ${colors[index % colors.length]} to-gray-950 border ${borderColor[index % colors.length]} rounded-3xl p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]`}>
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">{m.label}</p>
                                <p className="text-3xl font-light text-white tracking-tight leading-none mb-1">{m.value}</p>
                                <p className="text-[11px] font-medium text-white/40">{m.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-2 bg-linear-to-b from-gray-950 to-gray-800 rounded-2xl border border-white/10 p-5">
                    <p className="text-sm font-semibold text-white mb-4">Orders by Hour</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={hourlyVolume}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" stroke="transparent" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.28)" }} interval={3} />
                            <YAxis stroke="transparent" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.28)" }} />
                            <Tooltip content={<CustomAreaTooltip />} />
                            <Area type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2.5} fill="url(#areaGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 bg-linear-to-b from-gray-950 to-gray-900 rounded-2xl border border-white/10 p-5">
                    <p className="text-sm font-semibold text-white mb-4">Avg Order Value</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={tableAverages} innerRadius={62} outerRadius={84} paddingAngle={3} dataKey="value" nameKey="tableName">
                                {tableAverages.map((_, i) => <Cell key={i} fill={DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-3 mt-3">
                        {tableAverages.map((entry, i) => (
                            <span key={entry.tableName} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                <span className="w-2 h-2 rounded-sm" style={{ background: DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length] }} />
                                {entry.tableName}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}