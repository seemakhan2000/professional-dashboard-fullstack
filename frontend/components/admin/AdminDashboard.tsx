"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Gauge,
  Wallet,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import StatCard, { StatCardSkeleton } from "@/components/dashboard/StatCard";
import PerformanceChart, {
  PerformanceChartSkeleton
} from "@/components/dashboard/PerformanceChart";
import StatusChart, {
  StatusChartSkeleton
} from "@/components/dashboard/StatusChart";
import ActivityTable, {
  ActivityTableSkeleton
} from "@/components/dashboard/ActivityTable";
import RecordForm from "@/components/admin/RecordForm";

import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
} from "@/lib/api";
import { demoRecords, demoPerformanceSeries } from "@/data/dashboard";
import {
  DashboardRecord,
  DashboardRecordInput,
  RecordStatus
} from "@/types/dashboard";

type FilterValue = "All" | RecordStatus;

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DashboardRecord | null>(
    null
  );
  const [deletingRecord, setDeletingRecord] = useState<DashboardRecord | null>(
    null
  );

  const [toasts, setToasts] = useState<Toast[]>([]);

  function pushToast(type: Toast["type"], message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  async function loadRecords() {
    setLoading(true);
    try {
      const res = await getRecords();
      if (res.success && res.data && res.data.length > 0) {
        setRecords(res.data);
        setUsingDemoData(false);
      } else {
        setRecords(demoRecords);
        setUsingDemoData(true);
      }
    } catch {
      setRecords(demoRecords);
      setUsingDemoData(true);
      pushToast("error", "Could not connect to the API. Showing sample data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        search.trim() === "" ||
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status === "Active").length;
    const totalValue = records.reduce((sum, r) => sum + (r.value || 0), 0);
    const performance = total > 0 ? Math.round((active / total) * 100) : 0;

    return { total, active, totalValue, performance };
  }, [records]);

  function openCreateForm() {
    setEditingRecord(null);
    setFormOpen(true);
  }

  function openEditForm(record: DashboardRecord) {
    setEditingRecord(record);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: DashboardRecordInput) {
    if (usingDemoData) {
      pushToast(
        "error",
        "Connect a real backend/MongoDB to save changes permanently."
      );
    }

    try {
      if (editingRecord) {
        const res = await updateRecord(editingRecord._id, data);
        if (res.success) {
          pushToast("success", "Record updated successfully.");
        } else {
          pushToast("error", res.message || "Failed to update record.");
        }
      } else {
        const res = await createRecord(data);
        if (res.success) {
          pushToast("success", "Record created successfully.");
        } else {
          pushToast("error", res.message || "Failed to create record.");
        }
      }
    } catch {
      pushToast("error", "Unable to reach the server.");
    } finally {
      setFormOpen(false);
      setEditingRecord(null);
      loadRecords();
    }
  }

  async function confirmDelete() {
    if (!deletingRecord) return;

    try {
      const res = await deleteRecord(deletingRecord._id);
      if (res.success) {
        pushToast("success", "Record deleted successfully.");
      } else {
        pushToast("error", res.message || "Failed to delete record.");
      }
    } catch {
      pushToast("error", "Unable to reach the server.");
    } finally {
      setDeletingRecord(null);
      loadRecords();
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
   <Sidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  activePage="dashboard"
  onPageChange={() => {}}
/>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          search={search}
          onSearchChange={setSearch}
          isAdmin
          onLogoutClick={onLogout}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage records, monitor performance, and review activity.
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Add Record
            </button>
          </header>

          {usingDemoData && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle size={16} />
              Backend or database unavailable — showing sample data. Changes
              won&apos;t be saved until MongoDB is connected.
            </div>
          )}

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Records"
                  value={stats.total.toString()}
                  icon={Boxes}
                  accent="indigo"
                />
                <StatCard
                  label="Active Records"
                  value={stats.active.toString()}
                  icon={CheckCircle2}
                  accent="emerald"
                />
                <StatCard
                  label="Performance"
                  value={`${stats.performance}%`}
                  icon={Gauge}
                  accent="amber"
                />
                <StatCard
                  label="Total Value"
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0
                  }).format(stats.totalValue)}
                  icon={Wallet}
                  accent="sky"
                />
              </>
            )}
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {loading ? (
                <PerformanceChartSkeleton />
              ) : (
                <PerformanceChart data={demoPerformanceSeries} />
              )}
            </div>
            <div>
              {loading ? (
                <StatusChartSkeleton />
              ) : (
                <StatusChart records={records} />
              )}
            </div>
          </section>

          <section className="mb-4 flex flex-wrap items-center gap-2">
            {(["All", "Active", "Pending", "Inactive"] as FilterValue[]).map(
              (value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    filter === value
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {value}
                </button>
              )
            )}
          </section>

          {loading ? (
            <ActivityTableSkeleton />
          ) : (
            <ActivityTable
              records={filteredRecords}
              isAdmin
              onEdit={openEditForm}
              onDelete={setDeletingRecord}
            />
          )}
        </main>
      </div>

      {formOpen && (
        <RecordForm
          initialRecord={editingRecord}
          onCancel={() => {
            setFormOpen(false);
            setEditingRecord(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deletingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">
              Delete record?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              This will permanently delete{" "}
              <span className="font-medium text-gray-700">
                {deletingRecord.name}
              </span>
              . This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setDeletingRecord(null)}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
