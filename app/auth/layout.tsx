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
        router.replace("/admin/dashboard");
      } else if (user.role === "ROLE_CASHIER") {
        router.replace("/cashier/orders");
      }
      else if (user.role === "ROLE_WAITER") {
        router.replace("/waiter/orders");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || user) {
    return <Loader />
  }

  return <>{children}</>;
}