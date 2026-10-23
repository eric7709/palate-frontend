"use client";
import { useAuthStore } from '@/src/auth/store';
import { useMenuItemRealtime } from '@/src/shared/hooks/useMenuItemRealtime';
import { useOrderRealtime } from '@/src/shared/hooks/useOrderRealTime';
import Loader from '@/src/shared/components/loaders/Loader';
import { RoleType } from '@/src/auth/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const KITCHEN_ROLES: RoleType[] = ["ROLE_CHEF", "ROLE_COOK", "ROLE_BAKER"];

export default function ProtectKitchen({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();
    useMenuItemRealtime();
    useOrderRealtime();
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const isKitchenRole = Boolean(user?.role && KITCHEN_ROLES.includes(user.role));

    useEffect(() => {
        // Only run redirection logic after hydration is complete
        if (isHydrated) {
            if (!user) {
                router.push("/auth/login");
            } else if (!isKitchenRole) {
                router.push("/unauthorized");
            }
        }
    }, [user, isHydrated, isKitchenRole, router]);

    // Show a loading spinner/state while checking auth
    if (!isHydrated || !user || !isKitchenRole) {
        return <Loader />
    }

    return <>{children}</>;
}