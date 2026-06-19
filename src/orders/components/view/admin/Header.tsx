"use client"
import PageTitle from "@/src/shared/components/utils/PageTitle";
import { Filter } from "lucide-react";
import { useOrderStore } from "../../../store";

interface HeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function Header({ showFilters, onToggleFilters }: HeaderProps) {
  const { resetFilters } = useOrderStore();

  return (
    <div className="flex items-center gap-3">
      <PageTitle subTitle="Manage your restaurant orders" title="Orders" />

      <div className="flex-1" />

      <button
        onClick={onToggleFilters}
        className="group flex items-center gap-1.5 px-3 py-2 cursor-pointer text-xs font-medium rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 active:scale-95"
      >
        <Filter size={12} strokeWidth={2} />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>
    </div>
  );
}