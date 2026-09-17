"use client";

import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  X,
} from "lucide-react";

export type DashboardPage =
  | "dashboard"
  | "analytics"
  | "records"
  | "settings";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activePage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
}

const navItems = [
  {
    id: "dashboard" as DashboardPage,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "analytics" as DashboardPage,
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "records" as DashboardPage,
    label: "Records",
    icon: FileText,
  },
  {
    id: "settings" as DashboardPage,
    label: "Settings",
    icon: Settings,
  },
];

export default function Sidebar({
  open,
  onClose,
  activePage,
  onPageChange,
}: SidebarProps) {
  function handleNavigation(page: DashboardPage) {
    onPageChange(page);
    onClose();
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              DashPro
            </h2>
            <p className="text-xs text-gray-400">
              Management System
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}