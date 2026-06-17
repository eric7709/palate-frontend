"use client";

import { useAuthStore } from "@/src/auth/store";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, LogOut } from "lucide-react";

type Destination = {
  path: string;
  label: string;
};

export default function UnauthorizedPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const destination: Destination = (() => {
    switch (user?.role) {
      case "ROLE_ADMIN":
        return {
          path: "/admin/dashboard",
          label: "Admin Dashboard",
        };

      case "ROLE_CASHIER":
        return {
          path: "/cashier/orders",
          label: "Cashier Orders",
        };

      default:
        return {
          path: "/auth/login",
          label: "Sign In",
        };
    }
  })();

  const handleNavigate = () => {
    router.push(destination.path);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      <div className="w-full max-w-[320px]">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-bold text-white mb-1">
            Access Denied
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            You don’t have permission to view this page. Return to your
            assigned area or sign in again.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNavigate}
            className="w-full py-3 px-4 bg-white text-gray-900 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-[0.98]"
          >
            Go to {destination.label}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-500/15 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}