// ui/TableUnavailable.tsx
"use client";

import { AlertCircle } from "lucide-react";

export function TableUnavailable({ tableName, tableNumber }: {tableName: string , tableNumber: number}) {
  const displayName = tableName
    ? `"${tableName}"`
    : tableNumber
      ? `#${tableNumber}`
      : "this table";

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#1a1c2e_0%,#0a0b10_100%)] px-4">
      <div className="text-center space-y-5">
        <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/30">
          <AlertCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-white/90">Table {displayName}</h1>
        <p className="text-gray-400 max-w-sm">
          The table isn’t active yet. Please wait 2 minutes or ask a staff member to activate it.
        </p>
        <div className="pt-4">
          <span className="inline-block px-4 py-1.5 text-xs font-mono text-gray-500 bg-white/5 rounded-full">
            ❌ inactive
          </span>
        </div>
      </div>
    </div>
  );
}