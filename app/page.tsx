"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn } from 'lucide-react';
import { useAuthStore } from "@/src/auth/store";
import Logo from "@/src/shared/components/Logo";

export default function Homepage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ROLE_ADMIN') {
        router.push("/admin/home");
      } else if (user.role === 'ROLE_CASHIER') {
        router.push("/cashier/orders");
      } else {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex h-screen w-full justify-center items-center bg-slate-900">
      <div className="flex flex-col items-center text-center px-6">
        {/* Logo */}
        
        <div className="mb-0">
          <Logo height="h-20 md:h-24" />
        </div>

        {/* App name */}
        <p className="text-slate-400 text-sm md:text-base mb-10">
          Restaurant Management System
        </p>

        {/* Login Button */}
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full max-w-sm px-8 py-3 cursor-pointer bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <LogIn size={18} />
          Login
        </button>

        {/* Optional subtle footer */}
        <p className="text-slate-500 text-xs mt-8">
          Secure access for staff only
        </p>
      </div>
    </div>
  );
}