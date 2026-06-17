"use client";
import { useAuthStore } from '@/src/auth/store';
import { useMenuItemRealtime } from '@/src/shared/hooks/useMenuItemRealtime';
import { useOrderRealtime } from '@/src/shared/hooks/useOrderRealTime';
import Loader from '@/src/shared/components/Loader';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ProtectCashier({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();
    useMenuItemRealtime();
    useOrderRealtime();
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Only run redirection logic after hydration is complete
        if (isHydrated) {
            if (!user) {
                router.push("/auth/login");
            } else if (user.role !== "ROLE_CASHIER") {
                router.push("/unauthorized");
            }
        }
    }, [user, isHydrated, router]);

    // Show a loading spinner/state while checking auth
    if (!isHydrated || !user || user.role !== "ROLE_CASHIER") {
        return <Loader />
    }

    return <>{children}</>;
}