"use client"
import { BarChart3, ArrowUpRight, TrendingUp } from "lucide-react";
import { useHourlyRevenue } from "@/models/dashboard/hooks";
import Loader from "@/ui/Loader";
import { loaderStyle } from "@/models/dashboard/style";

export function HourlyRevenueChart() {
  const { data, isLoading } = useHourlyRevenue();


  if (isLoading || !data) {
    return <Loader height="h-80" style={loaderStyle}/>
  }

  const chartData = data.data;
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow shadow-slate-200/20 transition-all duration-300 hover:shadow-slate-200/60">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-slate-800 font-bold text-base tracking-tight">
              Hourly Revenue
            </h3>

            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 text-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold border border-emerald-200/50">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              {data.changePercent > 0 ? "+" : ""}
              {data.changePercent.toFixed(1)}%
            </span>
          </div>

          <p className="text-slate-500 text-xs flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Total generated today:
            <span className="text-slate-800 font-bold text-base">
              ₦{data.totalRevenue.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="p-2 rounded-xl bg-slate-100/80 text-slate-500 shadow-inner">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      <div className="relative pt-4 pb-2">
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-t border-slate-200" />
          <div className="border-b border-slate-200" />
        </div>

        <div className="relative h-56 w-full flex items-end justify-between gap-3">
          {chartData.map((item) => {
            const barHeightPct = (item.value / maxValue) * 100;

            return (
              <div
                key={item.hour}
                className="relative flex flex-col items-center flex-1 h-full group justify-end"
              >
                <div
                  className="w-full max-w9 rounded-t-xl transition-all duration-500 ease-out cursor-pointer shadow-md shadow-black/5 group-hover:shadow-lg group-hover:shadow-black/10"
                  style={{
                    height: `${barHeightPct}%`,
                    minHeight: "4px",
                    background: `linear-gradient(to top, ${
                      item.color || "#10b981"
                    }, ${item.color || "#10b981"}dd)`,
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:-top-12 whitespace-nowrap shadow-lg z-10">
                    {item.display}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-800" />
                  </div>
                </div>

                <span className="absolute -bottom-5 text-[9px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.display}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-2 border-t border-slate-200/80">
        {chartData.map((item) => (
          <div key={item.hour} className="flex-1 text-center">
            <span className="text-slate-500 text-[10px] font-medium tracking-wide uppercase">
              {item.hour}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}