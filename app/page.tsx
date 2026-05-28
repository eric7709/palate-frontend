"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChefHat } from 'lucide-react';
import { useAuthStore } from "@/models/auth/store";

export default function Homepage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ROLE_ADMIN') {
        router.push("/admin/dashboard");
      } else if (user.role === 'ROLE_CASHIER') {
        router.push("/cashier/orders");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleManualLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen w-full justify-center items-center text-white">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border-2 md:border-4 flex items-center justify-center">
            <ChefHat className="w-6 h-6 md:w-12 md:h-12" />
          </div>
          <h1 className="mt-4 md:mt-0 md:ml-6 text-4xl md:text-7xl font-extrabold tracking-tight">
            Palate
          </h1>
        </div>

        {/* Action Button */}
        <div className="mt-12 w-full px-6 max-w-sm">
          <button 
            onClick={handleManualLogin}
            className="w-full px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors shadow-lg"
          >
            Login to System
          </button>
        </div>
      </div>
    </div>
  )
}