import { ReactNode } from "react";

interface Metric {
  label: string;
  value: number | string;
  icon: ReactNode;
  bgColor: string;      // Tailwind background class (e.g. "bg-emerald-50")
  iconColor: string;    // Tailwind text class for icon (e.g. "text-emerald-600")
  valueColor: string;   // Tailwind text class for value (e.g. "text-emerald-700")
}

interface TwoMetricCardProps {
  title: string;
  subtitle?: string;               // optional right‑side text (e.g. "Status", "Today")
  headerIcon: ReactNode;           // icon in header (e.g. <UtensilsCrossed />)
  headerIconBg?: string;           // default "bg-emerald-50"
  headerIconColor?: string;        // default "text-emerald-600"
  leftMetric: Metric;
  rightMetric: Metric;
  className?: string;
}

export function TwoMetricCard({
  title,
  subtitle,
  headerIcon,
  headerIconBg = "bg-emerald-50",
  headerIconColor = "text-emerald-600",
  leftMetric,
  rightMetric,
  className = "",
}: TwoMetricCardProps) {
  return (
    <div className={`rounded-2xl bg-white border flex flex-col justify-between border-neutral-200 p-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${headerIconBg} ${headerIconColor}`}>
            {headerIcon}
          </div>
          <h3 className="text-neutral-900 font-semibold text-sm">{title}</h3>
        </div>
        {subtitle && <span className="text-neutral-400 text-[11px] font-medium">{subtitle}</span>}
      </div>

      {/* Two metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left metric */}
        <div className={`rounded-xl p-3 text-center ${leftMetric.bgColor}`}>
          <div className={`flex items-center justify-center gap-1.5 text-[11px] mb-1 ${leftMetric.iconColor}`}>
            {leftMetric.icon}
            <span>{leftMetric.label}</span>
          </div>
          <p className={`text-2xl font-bold ${leftMetric.valueColor}`}>{leftMetric.value}</p>
        </div>

        {/* Right metric */}
        <div className={`rounded-xl p-3 text-center ${rightMetric.bgColor}`}>
          <div className={`flex items-center justify-center gap-1.5 text-[11px] mb-1 ${rightMetric.iconColor}`}>
            {rightMetric.icon}
            <span>{rightMetric.label}</span>
          </div>
          <p className={`text-2xl font-bold ${rightMetric.valueColor}`}>{rightMetric.value}</p>
        </div>
      </div>
    </div>
  );
}