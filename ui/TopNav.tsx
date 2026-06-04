'use client';

import { useState } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/models/auth/store';
import { useRouter } from 'next/navigation';

export const TopNav = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const firstName = user?.firstName || 'Guest';

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-blue-500/30 bg-black/50 backdrop-blur-xl px-3 h-14 flex items-center justify-between">
      {/* Left */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white/90">
          Welcome back, {firstName}
        </span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Ready to continue?
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/5 border border-blue-500/30 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-blue-500/30">
              <span className="text-[9px] font-bold text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-gray-900/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-xl overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[9px] text-indigo-400 uppercase tracking-wider">{user?.role?.replace("ROLE_", "")}</p>
                </div>

                <div className="py-0.5">
                  <MenuButton icon={User} label="Profile" />
                  <MenuButton icon={Settings} label="System Settings" />
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={() => { logout(); router.push("/auth/login"); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-red-400 hover:bg-red-500/10 transition-colors"
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
    </nav>
  );
};

const MenuButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-300 hover:text-white hover:bg-white/5 transition-all">
    <Icon className="w-3.5 h-3.5 opacity-70" />
    {label}
  </button>
);