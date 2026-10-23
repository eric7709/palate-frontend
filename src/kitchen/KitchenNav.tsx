"use client";
import { ChefHat, LogOut, Flame } from "lucide-react";
import { useAuthStore } from "@/src/auth/store";
import { useGetPreparingOrdersToday } from "@/src/orders/hooks/hooks.api";
import { useRouter } from "next/navigation";

const ROLE_LABELS: Record<string, string> = {
  ROLE_CHEF: "Chef",
  ROLE_COOK: "Cook",
  ROLE_BAKER: "Baker",
};

export function KitchenNav() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { data: preparingOrders } = useGetPreparingOrdersToday();
  const preparingCount = preparingOrders?.length ?? 0;

  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : "";
  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white">
          <ChefHat size={18} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-900 tracking-tight">Palate Kitchen</span>
          <span className="text-[10px] font-medium text-slate-400">Order preparation</span>
        </div>
      </div>

      {/* Preparing orders indicator */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
        <Flame size={14} />
        <span className="text-xs font-bold">
          {preparingCount} preparing
        </span>
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-xs font-semibold text-slate-800">{fullName || "—"}</span>
          <span className="text-[10px] font-medium text-slate-400">{roleLabel}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 transition-all active:scale-95"
          title="Log out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}