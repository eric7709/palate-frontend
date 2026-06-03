"use client";
import { useAuthStore } from '@/models/auth/store';
import { useOrderRealtime } from '@/sockets/useOrderRealTime';
import Loader from '@/ui/Loader';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ProtectWaiter({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();
    useOrderRealtime();
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        // Only run redirection logic after hydration is complete
        if (isHydrated) {
            if (!user) {
                router.push("/auth/login");
            } else if (user.role !== "ROLE_WAITER") {
                router.push("/unauthorized");
            }
        }
    }, [user, isHydrated, router]);

    // Show a loading spinner/state while checking auth
    if (!isHydrated || !user || user.role !== "ROLE_WAITER") {
        return <Loader />
    }

    return <>{children}</>;
}