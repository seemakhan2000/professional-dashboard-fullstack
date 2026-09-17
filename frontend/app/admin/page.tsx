
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const SESSION_KEY = "dashboard_admin_session";

export default function AdminPage() {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);

      if (stored === "true") {
        setIsAdmin(true);
      }
    } catch {
      // sessionStorage unavailable
    } finally {
      setCheckedSession(true);
    }
  }, []);

  function handleLoginSuccess() {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore storage errors
    }

    setIsAdmin(true);
  }

  function handleLogout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore storage errors
    }

    setIsAdmin(false);

    // Logout ke baad User Dashboard par redirect
    router.push("/");
  }

  if (!checkedSession) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return isAdmin ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onSuccess={handleLoginSuccess} />
  );
}

