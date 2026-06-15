import React from "react";
import { FolderOpen } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function NoRecords({
  title = "No records found",
  description = "There is no data available to display right now.",
  icon,
}: Props) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8 w-full text-center rounded-2xl border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-4 shadow-sm">
        {icon ?? <FolderOpen className="w-6 h-6 stroke-[1.5]" />}
      </div>

      <div className="max-w-xs">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}