'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/models/auth/store';
import { LogOut, User, LayoutGrid, ClipboardList, UtensilsCrossed } from 'lucide-react';

export default function WaiterHeaderMenu() {
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
    { href: '/waiter/tables', label: 'Tables', icon: LayoutGrid },
    { href: '/waiter/orders', label: 'Orders', icon: ClipboardList },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-indigo-500/80 flex items-center justify-center text-white text-xs font-medium border border-white/10 hover:bg-indigo-500 transition-colors"
      >
        {user?.firstName?.charAt(0) || 'U'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1c21] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
          {/* User info */}
          <div className="px-4 py-2 border-b border-white/5 mb-1">
            <p className="text-white text-xs font-bold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-gray-500 uppercase">
              {user?.role?.replace('ROLE_', '')}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="px-2 pt-1 pb-1 border-b border-white/5">
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
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
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
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-0.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}