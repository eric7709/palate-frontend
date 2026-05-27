'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/models/auth/store';
import { useRouter } from 'next/navigation';

export const TopNav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore()

  const router = useRouter()

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem('darkMode', String(nextMode));

    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="h-14 border-b relative  bg-black border-gray-700 px-4 flex items-center justify-between">

      {/* Left */}
      <div>
        <h1 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Welcome back 👋
        </h1>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Palate Restaurant Management
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-xl flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white dark:text-black" />
            </div>

            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-52 bg-black rounded-2xl border border-neutral-200  shadow-xl overflow-hidden z-50">

                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user?.role?.replace("ROLE_", "")}
                  </p>
                </div>

                <div className="p-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                    <User className="w-4 h-4" />
                    Profile
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>

                  <button onClick={() => {
                    logout()
                    router.push("/auth/login")
                  }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                    <LogOut className="w-4 h-4" />
                    Logout
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