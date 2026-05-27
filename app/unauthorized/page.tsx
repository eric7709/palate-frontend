"use client";
import { useAuthStore } from '@/models/auth/store';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Home, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Determine the primary destination based on role
  const getDestination = () => {
    if (user?.role === "ROLE_ADMIN") return { path: "/admin/dashboard", label: "Admin Dashboard" };
    if (user?.role === "ROLE_CASHIER") return { path: "/cashier/orders", label: "Cashier Orders" };
    return { path: "/auth/login", label: "Return to Login" };
  };

  const destination = getDestination();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1c21] text-white p-6">
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-sm w-full text-center">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8 text-sm">
          You do not have permission to view this page. Please return to your assigned dashboard.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => router.push(destination.path)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to {destination.label}
          </button>

          <button 
            onClick={() => {
              logout();
              router.push("/auth/login");
            }}
            className="w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl text-gray-400 font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}