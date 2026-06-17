"use client"

import { DashboardPeriod } from "../../types";
import { getNextPeriod } from "../../utils";


// ============================================================
// ProgressBarList Component (standalone, reusable)
// ============================================================

interface ProgressItem {
  label: string;
  value: string;
  pct: number;
  color: string;
  rank?: number;
}

interface ProgressBarListProps {
  title: string;
  subtitle?: string;
  items: ProgressItem[];
  showRank?: boolean;
  period?: DashboardPeriod
  className?: string;
  setPeriod?: (e: DashboardPeriod) => void
}

export function ProgressBarList({
  title,
  subtitle,
  setPeriod,
  items,
  period,
  showRank = false,
  className = "",
}: ProgressBarListProps) {
  const DISTINCT_COLORS = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#8b5cf6", // Violet
    "#f59e0b", // Amber
    "#ec4899", // Pink
  ];

  const handleSubtitleClick = () => {
    if (!setPeriod || !period) return;
    const next = getNextPeriod(period)
    setPeriod(next)
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {subtitle && (
          <span
            onClick={handleSubtitleClick}
            className={`rounded-full select-none text-blue-600 font-semibold cursor-pointer bg-slate-100 px-2 py-0.5 text-[10px]  ${setPeriod ? "cursor-pointer" : ""}`}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Progress items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className={showRank ? "flex items-start gap-2" : ""}>
            {/* Rank number (if showRank) */}
            {showRank && item.rank !== undefined && (
              <span className="w-5 text-[11px] font-semibold text-slate-400">
                {item.rank}
              </span>
            )}
            <div className="flex-1">
              {/* Label and value row */}
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-700">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {item.value}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${item.pct}%`,
                    backgroundColor: DISTINCT_COLORS[index],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}