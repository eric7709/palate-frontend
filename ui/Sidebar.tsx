'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Shapes,
  ReceiptText,
  Armchair,
  ClipboardCheck,
  ChartColumn,
  ChefHat,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: Shapes,
  },
  {
    name: 'Menu Items',
    href: '/admin/menu-items',
    icon: UtensilsCrossed,
  },

  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ReceiptText,
  },
  {
    name: 'Tables',
    href: '/admin/tables',
    icon: Armchair,
  },
  {
    name: 'Employees',
    href: '/admin/employees',
    icon: Users,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartColumn,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen border-r border-neutral-200 dark:border-neutral-800 flex flex-col">

      {/* Logo */}
      <div className="h-14 px-4 border-b relative border-gray-700 flex items-center ">
        <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-white dark:text-black" />
        </div>

        <h1 className="ml-2 text-sm font-semibold text-neutral-900 dark:text-white">
          Palate
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200 ${isActive
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />

              <span className="text-[13px] font-medium truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}