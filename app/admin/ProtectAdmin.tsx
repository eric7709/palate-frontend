"use client";
import { useAuthStore } from '@/models/auth/store';
import { useMenuItemRealtime } from '@/sockets/useMenuItemRealtime';
import { useOrderRealtime } from '@/sockets/useOrderRealTime';
import Loader from '@/ui/Loader';
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