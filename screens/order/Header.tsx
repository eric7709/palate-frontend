import { useOrderStore } from "@/models/order/store";
import PageTitle from "@/ui/PageTitle";
import { Filter, RefreshCcw } from "lucide-react";

interface HeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function Header({ showFilters, onToggleFilters }: HeaderProps) {
  const { resetFilters } = useOrderStore();

  return (
    <div className="flex items-center gap-3">
      <PageTitle subTitle="Manage your restaurant orders" title="Orders" />

      <div className="flex-1" />

      <button
        onClick={onToggleFilters}
        className="group flex items-center gap-1.5 px-3 py-2 cursor-pointer text-xs font-medium rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-200 transition-all duration-200 active:scale-95"
      >
        <Filter size={12} strokeWidth={2} />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>
    </div>
  );
}