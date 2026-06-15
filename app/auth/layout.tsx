"use client";
import { useAuthStore } from '@/models/auth/store';
import Loader from '@/ui/Loader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && user) {
      if (user.role === "ROLE_ADMIN") {
        router.replace("/admin/home");
      } else if (user.role === "ROLE_CASHIER") {
        router.replace("/cashier/orders");
      } else if (user.role === "ROLE_WAITER") {
        router.replace("/waiter/orders");
      } else {
        router.replace("/");
      }
    }
  }, [user, isHydrated, router]);

  // Light‑theme loader style (override if your Loader accepts a className or style prop)
  const lightLoaderStyle = "bg-white border border-gray-200 shadow-sm";

  if (!isHydrated || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className={lightLoaderStyle}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}