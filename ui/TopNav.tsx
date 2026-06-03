'use client';

import { useState } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/models/auth/store';
import { useRouter } from 'next/navigation';

export const TopNav = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Get first name or fallback
  const firstName = user?.firstName || 'Guest';

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-blue-500/30 bg-black/50 backdrop-blur-xl px-3 h-14 flex items-center justify-between">
      {/* Left: Welcome message */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white/90">
          Welcome back, {firstName}
        </span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Ready to continue?
        </span>
      </div>

      {/* Right: Actions (unchanged) */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-blue-500/30 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-blue-500/30">
              <span className="text-[10px] font-bold text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-3 w-60 bg-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-indigo-400 uppercase tracking-wider">{user?.role?.replace("ROLE_", "")}</p>
                </div>

                <div className="py-1">
                  <MenuButton icon={User} label="Profile" />
                  <MenuButton icon={Settings} label="System Settings" />
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={() => { logout(); router.push("/auth/login"); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const MenuButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
    <Icon className="w-4 h-4 opacity-70" />
    {label}
  </button>
);