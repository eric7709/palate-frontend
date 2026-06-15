'use client';

import { Bell, Plus } from 'lucide-react';
import { useAuthStore } from '@/models/auth/store';
import { useMenuItemStore } from '@/models/menuItem/store';


export const TopNav = () => {
  const { user } = useAuthStore();
  const { setModal } = useMenuItemStore()
  const firstName = user?.firstName || 'Guest';

  const getSubheading = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning — let’s make today exceptional';
    if (hour < 17) return 'Good afternoon — welcome back';
    return 'Good evening — time to reflect';
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-neutral-200/80">
      <div className="flex items-center justify-between px-6 h-16">

        {/* Left side – Editorial Greeting Hierarchy */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold tracking-tight text-neutral-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs font-medium text-neutral-500">
            {getSubheading()}
          </p>
        </div>

        {/* Right side – Premium Action Items */}
        <div className="flex items-center gap-4">

          {/* High-End Interactive Add Action Button */}
          <button
            onClick={() => {
              setModal("createMenuItem")
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-amber-500 border border-gray-200 active:scale-90 hover:bg-amber-500 cursor-pointer active:scale-[0.98] rounded-full shadow-sm transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Menu Item</span>
          </button>

          {/* Icon Scale Notification Action Wrapper */}
          <button className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-all duration-200 group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Layout Structural Divider Grid Element */}
          <div className="w-px h-5 bg-neutral-200" />

          {/* Compact Profile Avatar Display Component */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm text-white font-bold text-xs select-none uppercase tracking-wider">
              {user?.firstName?.[0] || 'G'}
              {user?.lastName?.[0] || ''}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};