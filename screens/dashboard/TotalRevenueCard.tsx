"use client"
import { TrendingUp, Wallet } from "lucide-react";
import Loader from "@/ui/Loader";
import { loaderStyle } from "@/models/dashboard/style";
import { DashboardPeriod, DashboardSummaryDTO } from '@/models/dashboard/types';
import { getLabel, getNextPeriod, getVSLabel } from "@/models/dashboard/utils";

type Props = {
  data: DashboardSummaryDTO | undefined
  setPeriod: (e: DashboardPeriod) => void
  period: DashboardPeriod
  isLoading: boolean
}
export function TotalRevenueCard({ data, isLoading, period, setPeriod }: Props) {

  if (isLoading || !data) {
    return <Loader height="h-40" style={loaderStyle} />;
  }

  const change =
    data.previousRevenue > 0
      ? ((data.totalRevenue - data.previousRevenue) /
        data.previousRevenue) *
      100
      : 0;





  return (
    <div className="rounded-2xl select-none bg-linear-to-br from-emerald-50 to-white border border-emerald-200 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-[11px] font-medium tracking-wide uppercase mb-1">
            Total revenue
          </p>

          <p className="text-3xl font-bold text-neutral-900 tracking-tight">
            ₦{data.totalRevenue.toLocaleString()}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-0.5 text-emerald-600 text-xs font-medium bg-emerald-100 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" />
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>

            <span className="text-neutral-400 text-[11px]">
              {getVSLabel(period)}
            </span>
          </div>
        </div>

        <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-emerald-100 text-[11px]  flex justify-between">
        <span>
          Previous: ₦{data.previousRevenue.toLocaleString()}
        </span>
        <span
          onClick={() => {
            const next = getNextPeriod(period)
            setPeriod(next)
          }}
          className="text-blue-500 font-semibold cursor-pointer">💰 {getLabel(period)}</span>
      </div>
    </div>
  );
}