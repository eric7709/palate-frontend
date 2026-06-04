// ui/TableUnavailable.tsx
"use client";

import { AlertCircle } from "lucide-react";

interface TableUnavailableProps {
  tableName?: string;
  tableNumber?: number;
  message?: string;
}

export function TableUnavailable({
  tableName,
  tableNumber,
  message,
}: TableUnavailableProps) {
  const displayName = tableName
    ? `"${tableName}"`
    : tableNumber
      ? `#${tableNumber}`
      : "this table";

  return (
    <div className="h-screen w-full flex items-center justify-center bg-linear-to-br from-[#0a0b10] to-[#111218] px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Icon with subtle glow */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
            <div className="relative bg-rose-500/10 rounded-full p-5 border border-rose-500/30">
              <AlertCircle className="w-12 h-12 text-rose-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Table {displayName}
        </h1>

        <div className="text-gray-400 ">

          {/* Message */}
          <p className="text-sm leading-relaxed">
            {message ||
              "This table is currently unavailable because no cashier or waiter has been assigned. "}
          </p>
          <p className="mt-2 font-semibold">Please contact a manager.</p>
        </div>
        {/* Decorative line */}
        <div className="w-12 h-0.5 bg-white/10 rounded-full mx-auto" />
      </div>
    </div>
  );
}