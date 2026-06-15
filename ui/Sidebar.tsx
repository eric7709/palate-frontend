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
  DoorOpen,
  ChartColumn,
  LogOut,
  User,
  Settings,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/models/auth/store';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Home', href: '/admin/home', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartColumn },
    ],
  },
  {
    title: 'Menu',
    items: [
      { name: 'Categories', href: '/admin/categories', icon: Shapes },
      { name: 'Menu Items', href: '/admin/menu-items', icon: UtensilsCrossed },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ReceiptText },
      { name: 'Tables', href: '/admin/tables', icon: Armchair },
      { name: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
    ],
  },
  {
    title: 'People',
    items: [
      { name: 'Employees', href: '/admin/employees', icon: Users },
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isSectionActive = (items: { href: string }[]) => {
    return items.some((item) => pathname.startsWith(item.href));
  };

  const firstName = user?.firstName || 'Guest';
  const userInitials = user?.firstName?.[0] && user?.lastName?.[0]
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'G';

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
    setUserMenuOpen(false);
  };

  return (
    <aside className="w-68.75 h-screen border-r border-gray-100 bg-white flex flex-col shadow-sm relative">
      {/* Brand */}
      <div className="h-16 border-b border-gray-100 flex items-center pl-5 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto bg-white scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300">
        {navigationSections.map((section, idx) => {
          const active = isSectionActive(section.items);

          return (
            <div key={section.title} className={idx > 0 ? 'mt-6' : ''}>
              {/* Section header */}
              <div className="flex items-center gap-1.5 px-3.5 mb-2">
                <span className={`w-1 h-1 rounded-full transition-all ${active ? 'bg-blue-500 scale-100' : 'bg-gray-300 scale-75'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                  {section.title}
                </p>
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 overflow-hidden ${
                        isActive
                          ? 'bg-linear-to-r from-blue-50 to-white text-blue-700 font-semibold shadow-sm'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full animate-in slide-in-from-left" />
                      )}
                      <item.icon
                        className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                          isActive ? 'text-blue-600 scale-105' : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-105'
                        }`}
                      />
                      <span className="text-[12.5px] font-medium tracking-wide truncate">{item.name}</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User dropdown + version footer */}
      <div className="border-t border-gray-100 p-3 mt-auto space-y-2">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center justify-between gap-2 rounded-xl p-2 transition-all duration-200 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-white">
                <span className="text-xs font-bold text-white">{userInitials}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-gray-800">{firstName}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                  {user?.role?.replace('ROLE_', '') || 'User'}
                </span>
              </div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2.5 mb-1 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName || 'Profile'}
                  </p>
                  <p className="text-[9px] text-blue-600 font-black uppercase tracking-wider mt-0.5">
                    {user?.role?.replace('ROLE_', '') || 'User'}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      router.push('/admin/profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push('/admin/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-1.5" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}