"use client";
import { useState } from "react";
import { Clock, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, UtensilsCrossed } from "lucide-react";
import { DashboardPeriod } from "../../types";
import { useQuickStats } from "../../hooks";
import Loader from "@/src/shared/components/loaders/Loader";
import { loaderStyle } from "../../style";
import { getLabel, getNextPeriod } from "../../utils";

const getIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("revenue") || lower.includes("sales")) return <DollarSign className="w-3.5 h-3.5" />;
  if (lower.includes("order")) return <ShoppingBag className="w-3.5 h-3.5" />;
  if (lower.includes("customer")) return <Users className="w-3.5 h-3.5" />;
  if (lower.includes("item") || lower.includes("menu")) return <UtensilsCrossed className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

const getColorScheme = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("revenue")) return { bg: "bg-emerald-50", icon: "text-emerald-600" };
  if (lower.includes("order")) return { bg: "bg-indigo-50", icon: "text-indigo-600" };
  if (lower.includes("customer")) return { bg: "bg-amber-50", icon: "text-amber-600" };
  if (lower.includes("item")) return { bg: "bg-rose-50", icon: "text-rose-600" };
  return { bg: "bg-slate-100", icon: "text-slate-500" };
};

export function QuickStatsCard() {
  const [period, setPeriod] = useState<DashboardPeriod>("TODAY");
  const { data, isLoading } = useQuickStats(period);
  if (isLoading) {
    return <Loader height="h-40" style={loaderStyle} />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Quick Stats</h3>
        <div
          onClick={() => setPeriod(getNextPeriod(period))}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 cursor-pointer"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          {getLabel(period)}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {data?.stats.map((stat) => {
          const { bg, icon: iconColor } = getColorScheme(stat.label);
          const Icon = () => getIcon(stat.label);
          const isPositive = stat.sub.includes("+") && !stat.sub.includes("-");
          const showTrend = stat.sub.includes("+") || stat.sub.includes("-");
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-slate-50/80"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${iconColor}`}>
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <p className="text-base font-bold text-slate-900 leading-tight">{stat.value}</p>
              </div>
              <div className="text-right">
                {showTrend ? (
                  <div className={`flex items-center gap-0.5 text-[11px] font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{stat.sub}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">{stat.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}