"use client";

import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  isAdmin?: boolean;
  onAdminLoginClick?: () => void;
  onLogoutClick?: () => void;
  pageTitle?: string;
}

export default function Navbar({
  onMenuClick,
  search,
  onSearchChange,
  isAdmin = false,
  onAdminLoginClick,
  onLogoutClick,
  pageTitle = "Dashboard",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <span className="hidden text-sm font-semibold text-gray-900 sm:inline">
        {pageTitle}
      </span>

      <div className="ml-auto flex flex-1 items-center gap-3 sm:flex-initial sm:gap-4">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <button
          className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
        </button>

        {isAdmin ? (
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <LogOut size={16} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        ) : (
          <button
            onClick={onAdminLoginClick}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <ShieldCheck size={16} />

            <span className="hidden sm:inline">
              Admin Login
            </span>
          </button>
        )}
      </div>
    </header>
  );
}