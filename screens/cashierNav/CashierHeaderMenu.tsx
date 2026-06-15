'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/models/auth/store';
import { LogOut, User, LayoutGrid, ClipboardList, UtensilsCrossed } from 'lucide-react';

export default function CashierHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/cashier/tables', label: 'Tables', icon: LayoutGrid },
    { href: '/cashier/orders', label: 'Orders', icon: ClipboardList },
    { href: '/cashier/menu-items', label: 'Menu Items', icon: UtensilsCrossed },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button – light theme */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors"
      >
        {user?.firstName?.charAt(0) || 'U'}
      </button>

      {/* Dropdown Menu – light theme */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in duration-200">
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-gray-800 text-xs font-bold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-gray-500 uppercase">
              {user?.role?.replace('ROLE_', '')}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="px-2 pt-1 pb-1 border-b border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Profile & Logout */}
          <div className="px-2 pt-1">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => {
                // Add profile action later
                setIsOpen(false);
              }}
            >
              <User className="w-3.5 h-3.5" /> Profile
            </button>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors mt-0.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}