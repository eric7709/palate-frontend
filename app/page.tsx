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
      else if (user.role === 'ROLE_WAITER') {
        router.push("/waiter/orders");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex h-screen w-full justify-center items-center text-white">
      <div className="flex flex-col items-center">

        {/* Logo */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border-2 md:border-4 flex items-center justify-center">
            <ChefHat className="w-6 h-6 md:w-12 md:h-12" />
          </div>
          <h1 className="mt-4 md:mt-0 md:ml-6 text-4xl md:text-7xl font-extrabold tracking-tight flex">
            {"Palate".split("").map((letter, i) => (
              <span
                key={i}
                className="animate-wave-color"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Action Button */}
        <div className="mt-12 w-full px-6 max-w-sm">
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full px-8 cursor-pointer py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors shadow-lg animate-pulse-scale"
        >
            Login to System
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wave-color {
          0%, 100% { color: white; }
          25%       { color: #a78bfa; }
          50%       { color: #818cf8; }
          75%       { color: #38bdf8; }
        }

        .animate-wave-color {
          animation: wave-color 3s ease-in-out infinite;
        }
      `}</style>
      <style jsx global>{`
  @keyframes wave-color {
    0%, 100% { color: white; }
    25%       { color: #a78bfa; }
    50%       { color: red; }
    75%       { color: #38bdf8; }
  }

  .animate-wave-color {
    animation: wave-color 8s ease-in-out infinite;
  }

  @keyframes pulse-scale {
    0%, 100% { transform: scale(1);    }
    50%       { transform: scale(1.04); }
  }

  .animate-pulse-scale {
    animation: pulse-scale 7s ease-in-out infinite;
  }
`}</style>
    </div>
  );
}