"use client"
import { Clock } from "lucide-react";

interface GridSkeletonProps {
  cols?: number;      // 🟢 Number of grid columns for the parent container (Default: 4)
  rows?: number;      // 🟢 Number of grid rows for the parent container (Default: 2)
  cardItemRows?: number; // Internal fake menu items inside each individual card
}

export function OrderGridSkeleton({ cols = 4, rows = 2, cardItemRows = 3 }: GridSkeletonProps) {
  // Calculate total number of placeholder cards to render
  const totalCards = cols * rows;

  return (
    <div 
      className="grid gap-4 w-full mt-4"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
      }}
    >
      {Array.from({ length: totalCards }).map((_, cardIndex) => (
        <div 
          key={cardIndex} 
          className="relative flex flex-col h-[380px] w-full rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden select-none animate-pulse"
        >
          {/* Header Top-Line */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="h-4 w-16 bg-slate-200 rounded-md" />
              <div className="flex items-center gap-1 mt-1.5">
                <Clock className="w-3 h-3 text-slate-200" />
                <div className="h-2.5 w-14 bg-slate-200 rounded-sm" />
              </div>
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
          </div>

          {/* Internal Card Metadata Block (Mirrors the Table/Room info block) */}
          <div className="grid grid-cols-3 gap-x-2 px-4 py-2.5 bg-white border-b border-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-2.5 w-10 bg-slate-200 rounded-xs mb-1" />
                <div className="h-3.5 w-16 bg-slate-200 rounded-sm" />
              </div>
            ))}
          </div>

          {/* Scrollable Items Block List */}
          <div className="flex-1 px-4 py-2.5 space-y-2 overflow-hidden bg-slate-50/20">
            {Array.from({ length: cardItemRows }).map((_, index) => (
              <div key={index} className="flex justify-between items-start gap-2 text-xs py-1 border-b border-slate-100/40 last:border-0">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="h-3.5 w-6 bg-slate-200 rounded-sm shrink-0" />
                    <div className="h-3.5 w-32 bg-slate-200 rounded-sm" />
                  </div>
                  <div className="h-4 w-16 bg-slate-200 rounded-md mt-0.5" />
                </div>
                <div className="h-3.5 w-14 bg-slate-200 rounded-sm mt-0.5 shrink-0" />
              </div>
            ))}
          </div>

          {/* Card Footer Interaction Bar */}
          <div className="mt-auto px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-200">Total Amount</p>
              <div className="h-5 w-24 bg-slate-200 rounded-md" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-8 w-28 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}