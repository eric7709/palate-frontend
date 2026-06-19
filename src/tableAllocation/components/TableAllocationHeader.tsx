"use client";
// components/TableAllocationHeader.tsx
import PageTitle from "@/src/shared/components/utils/PageTitle";
import { Eye, EyeOff } from "lucide-react";

interface HeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function TableAllocationHeader({ showFilters, onToggleFilters }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <PageTitle
        subTitle="Manage staff assignments to tables"
        title="Table Allocations"
      />
      <button
        onClick={onToggleFilters}
        className="group flex items-center gap-1.5 px-3 py-2 cursor-pointer text-xs font-medium rounded-full bg-indigo-500/5 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-200 transition-all duration-200 active:scale-95"
      >
        {showFilters ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide Filters</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Show Filters</span>
          </>
        )}
      </button>
    </div>
  );
}