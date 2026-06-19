"use client";
import { useAuthStore } from '@/src/auth/store';
import { useMenuItemRealtime } from '@/src/shared/hooks/useMenuItemRealtime';
import { useOrderRealtime } from '@/src/shared/hooks/useOrderRealTime';
import Loader from '@/src/shared/components/loaders/Loader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function ProtectAdmin({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();
    useMenuItemRealtime();
    useOrderRealtime();
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    const name = 'Prosper'

    useEffect(() => {
        if (isHydrated) {
            if (!user) {
                router.push("/auth/login");
            } else if (user.role !== "ROLE_ADMIN") {
                router.push("/unauthorized");
            }
        }
    }, [user, isHydrated, router]);

    if (!isHydrated || !user || user.role !== "ROLE_ADMIN") {
        return <Loader />
    }

    return <>{children}</>;
}