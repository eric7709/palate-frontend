'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CashierNavLinks() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/cashier/tables"
                className={`flex items-center gap-2 px-3 py-2 text-xs transition-all rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isActive('/cashier/tables')
                        ? 'bg-blue-600/20 text-white border-blue-500/50'
                        : 'text-gray-300 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
            >
                Tables
            </Link>
            <Link
                href="/cashier/orders"
                className={`flex items-center gap-2 px-3 py-2 text-xs transition-all rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isActive('/cashier/orders')
                        ? 'bg-blue-600/20 text-white border-blue-500/50'
                        : 'text-gray-300 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
            >
                Orders
            </Link>
            <Link
                href="/cashier/menu-items"
                className={`flex items-center gap-2 px-3 py-2 text-xs transition-all rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isActive('/cashier/menu-items')
                        ? 'bg-blue-600/20 text-white border-blue-500/50'
                        : 'text-gray-300 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
            >
                Menu Items
            </Link>
        </div>
    );
}