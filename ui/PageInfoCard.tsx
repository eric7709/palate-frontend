import { TrendingDown, TrendingUp } from "lucide-react";

const ACCENTS = [
  { accent: "bg-indigo-500", icon: "text-indigo-600", value: "text-indigo-700" },
  { accent: "bg-emerald-500", icon: "text-emerald-600", value: "text-emerald-700" },
  { accent: "bg-orange-500", icon: "text-orange-600", value: "text-orange-700" },
  { accent: "bg-rose-500", icon: "text-rose-600", value: "text-rose-700" },
  { accent: "bg-violet-500", icon: "text-violet-600", value: "text-violet-700" },
  { accent: "bg-cyan-500", icon: "text-cyan-600", value: "text-cyan-700" },
  { accent: "bg-amber-500", icon: "text-amber-600", value: "text-amber-700" },
  { accent: "bg-fuchsia-500", icon: "text-fuchsia-600", value: "text-fuchsia-700" },
];

interface PageInfoCardProps {
  index?: number;
  data: {
    label: string;
    value: number;
    unit?: string;
    previousValue?: number;
    icon: React.ReactNode;
  };
  bg?: string;          // optional custom bg class for the top bar
  iconColor?: string;   // optional custom icon text color
  valueColor?: string;  // optional custom value text color
}

export default function PageInfoCard({ index = 0, data, bg, iconColor, valueColor }: PageInfoCardProps) {
  const { label, value, unit = "", previousValue, icon } = data;

  // Determine which styles to use
  let accentClass = bg || ACCENTS[index % ACCENTS.length].accent;
  let iconClass = iconColor || (bg ? "text-neutral-600" : ACCENTS[index % ACCENTS.length].icon);
  let valClass = valueColor || (bg ? "text-neutral-800" : ACCENTS[index % ACCENTS.length].value);

  const formatted =
    unit === "₦" ? `₦${value.toLocaleString()}`
    : unit === "%" ? `${value}%`
    : value.toLocaleString();

  const trend = previousValue && previousValue > 0
    ? ((value - previousValue) / previousValue) * 100 : null;

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden transition hover:shadow-md">
      <div className={`h-1 ${accentClass}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 ${iconClass}`}>
            {icon}
          </div>
          {trend !== null && (
            <span className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
              {trend >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>

        <div>
          <p className={`text-2xl font-bold leading-none tracking-tight ${valClass}`}>{formatted}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">{label}</p>
        </div>
      </div>
    </div>
  );
}