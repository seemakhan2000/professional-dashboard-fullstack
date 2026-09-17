
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  Gauge,
  Settings as SettingsIcon,
  Wallet,
} from "lucide-react";

import Sidebar, {
  DashboardPage,
} from "@/components/layout/Sidebar";

import Navbar from "@/components/layout/Navbar";

import StatCard, {
  StatCardSkeleton,
} from "@/components/dashboard/StatCard";

import PerformanceChart, {
  PerformanceChartSkeleton,
} from "@/components/dashboard/PerformanceChart";

import StatusChart, {
  StatusChartSkeleton,
} from "@/components/dashboard/StatusChart";

import ActivityTable, {
  ActivityTableSkeleton,
} from "@/components/dashboard/ActivityTable";

import { getRecords } from "@/lib/api";
import {
  demoRecords,
  demoPerformanceSeries,
} from "@/data/dashboard";

import {
  DashboardRecord,
  RecordStatus,
} from "@/types/dashboard";

type FilterValue = "All" | RecordStatus;

export default function Dashboard() {
  const router = useRouter();

  /* --------------------------------
     DATA STATE
  -------------------------------- */

  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [usingDemoData, setUsingDemoData] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  /* --------------------------------
     LAYOUT STATE
  -------------------------------- */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activePage, setActivePage] =
    useState<DashboardPage>("dashboard");

  /* --------------------------------
     SEARCH / FILTER STATE
  -------------------------------- */

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState<FilterValue>("All");

  /* --------------------------------
     LOAD RECORDS
  -------------------------------- */

  useEffect(() => {
    let isMounted = true;

    async function loadRecords() {
      setLoading(true);

      try {
        const res = await getRecords();

        if (!isMounted) return;

        if (
          res.success &&
          res.data &&
          res.data.length > 0
        ) {
          setRecords(res.data);
          setUsingDemoData(false);
          setErrorMessage(null);
        } else {
          setRecords(demoRecords);
          setUsingDemoData(true);
          setErrorMessage(null);
        }
      } catch {
        if (!isMounted) return;

        setRecords(demoRecords);
        setUsingDemoData(true);

        setErrorMessage(
          "Could not connect to the API. Showing sample data instead."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  /* --------------------------------
     FILTERED RECORDS
  -------------------------------- */

  const filteredRecords = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        searchValue === "" ||
        record.name
          .toLowerCase()
          .includes(searchValue) ||
        record.category
          .toLowerCase()
          .includes(searchValue);

      const matchesFilter =
        filter === "All" ||
        record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  /* --------------------------------
     MAIN STATISTICS
  -------------------------------- */

  const stats = useMemo(() => {
    const total = records.length;

    const active = records.filter(
      (record) => record.status === "Active"
    ).length;

    const pending = records.filter(
      (record) => record.status === "Pending"
    ).length;

    const inactive = records.filter(
      (record) => record.status === "Inactive"
    ).length;

    const totalValue = records.reduce(
      (sum, record) =>
        sum + (record.value || 0),
      0
    );

    const performance =
      total > 0
        ? Math.round((active / total) * 100)
        : 0;

    return {
      total,
      active,
      pending,
      inactive,
      totalValue,
      performance,
    };
  }, [records]);

  /* --------------------------------
     PAGE TITLES
  -------------------------------- */

  const pageTitles: Record<
    DashboardPage,
    string
  > = {
    dashboard: "Dashboard",
    analytics: "Analytics",
    records: "Records",
    settings: "Settings",
  };

  /* --------------------------------
     PAGE DESCRIPTIONS
  -------------------------------- */

  const pageDescriptions: Record<
    DashboardPage,
    string
  > = {
    dashboard:
      "Overview of your organization's records and performance.",

    analytics:
      "Analyze business performance, records, and status distribution.",

    records:
      "View and search all organization records.",

    settings:
      "Manage dashboard preferences and configuration.",
  };

  /* --------------------------------
     DASHBOARD CONTENT
  -------------------------------- */

  function renderDashboard() {
    return (
      <>
        {/* Header */}

        <header className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Business Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            A read-only summary of your
            organization&apos;s records and
            performance.
          </p>
        </header>

        {/* Error */}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={16} />

            {errorMessage}
          </div>
        )}

        {/* Demo Data */}

        {usingDemoData && !errorMessage && (
          <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            Showing sample data. Add records from
            the Admin Dashboard to see live data
            here.
          </div>
        )}

        {/* Stats */}

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
                value={new Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }
                ).format(stats.totalValue)}
                icon={Wallet}
                accent="sky"
              />
            </>
          )}
        </section>

        {/* Charts */}

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <PerformanceChartSkeleton />
            ) : (
              <PerformanceChart
                data={demoPerformanceSeries}
              />
            )}
          </div>

          <div>
            {loading ? (
              <StatusChartSkeleton />
            ) : (
              <StatusChart
                records={records}
              />
            )}
          </div>
        </section>

        {/* Filters */}

        <section className="mb-4 flex flex-wrap items-center gap-2">
          {(
            [
              "All",
              "Active",
              "Pending",
              "Inactive",
            ] as FilterValue[]
          ).map((value) => (
            <button
              key={value}
              onClick={() =>
                setFilter(value)
              }
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {value}
            </button>
          ))}
        </section>

        {/* Activity Table */}

        {loading ? (
          <ActivityTableSkeleton />
        ) : (
          <ActivityTable
            records={filteredRecords}
            isAdmin={false}
          />
        )}
      </>
    );
  }

  /* --------------------------------
     ANALYTICS CONTENT
  -------------------------------- */

  function renderAnalytics() {
    return (
      <>
        {/* Header */}

        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
              <BarChart3 size={22} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Analytics
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Analyze your business performance
                and record activity.
              </p>
            </div>
          </div>
        </header>

        {/* Analytics Stats */}

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
                label="Active"
                value={stats.active.toString()}
                icon={CheckCircle2}
                accent="emerald"
                trend={
                  stats.total > 0
                    ? `${stats.performance}% of total`
                    : undefined
                }
              />

              <StatCard
                label="Pending"
                value={stats.pending.toString()}
                icon={Gauge}
                accent="amber"
              />

              <StatCard
                label="Total Value"
                value={new Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }
                ).format(stats.totalValue)}
                icon={Wallet}
                accent="sky"
              />
            </>
          )}
        </section>

        {/* Analytics Charts */}

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <PerformanceChartSkeleton />
            ) : (
              <PerformanceChart
                data={demoPerformanceSeries}
              />
            )}
          </div>

          <div>
            {loading ? (
              <StatusChartSkeleton />
            ) : (
              <StatusChart
                records={records}
              />
            )}
          </div>
        </section>

        {/* Analytics Breakdown */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Records
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stats.active}
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Currently active
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending Records
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stats.pending}
            </p>

            <p className="mt-1 text-xs text-amber-600">
              Require attention
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Inactive Records
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stats.inactive}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Currently inactive
            </p>
          </div>
        </section>
      </>
    );
  }

  /* --------------------------------
     RECORDS CONTENT
  -------------------------------- */

  function renderRecords() {
    return (
      <>
        {/* Header */}

        <header className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Records
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and search all available
            organization records.
          </p>
        </header>

        {/* Record Summary */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {stats.active}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {stats.pending}
            </p>
          </div>
        </section>

        {/* Filters */}

        <section className="mb-4 flex flex-wrap items-center gap-2">
          {(
            [
              "All",
              "Active",
              "Pending",
              "Inactive",
            ] as FilterValue[]
          ).map((value) => (
            <button
              key={value}
              onClick={() =>
                setFilter(value)
              }
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {value}
            </button>
          ))}
        </section>

        {/* Records Table */}

        {loading ? (
          <ActivityTableSkeleton />
        ) : (
          <ActivityTable
            records={filteredRecords}
            isAdmin={false}
          />
        )}
      </>
    );
  }

  /* --------------------------------
     SETTINGS CONTENT
  -------------------------------- */

  function renderSettings() {
    return (
      <>
        {/* Header */}

        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2.5 text-gray-700">
              <SettingsIcon size={22} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your dashboard preferences.
              </p>
            </div>
          </div>
        </header>

        {/* Settings Cards */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Dashboard Access */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Dashboard Access
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control access to the administration
              area.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Admin Dashboard
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Manage records and application
                  data.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push("/admin")
                }
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Open Admin
              </button>
            </div>
          </div>

          {/* Notifications */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure dashboard notification
              preferences.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Dashboard Alerts
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Receive important dashboard
                  updates.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Enabled
              </span>
            </div>
          </div>

          {/* Data Source */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Data Source
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current dashboard data source.
            </p>

            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                MongoDB API
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Dashboard records are loaded from
                the connected backend API.
              </p>

              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Connected
              </span>
            </div>
          </div>

          {/* Application Info */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Application
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Dashboard application information.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">
                  Application
                </span>

                <span className="text-sm font-medium text-gray-900">
                  DashPro
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-500">
                  Version
                </span>

                <span className="text-sm font-medium text-gray-900">
                  1.0.0
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Status
                </span>

                <span className="text-sm font-medium text-emerald-600">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* --------------------------------
     MAIN PAGE CONTENT SWITCH
  -------------------------------- */

  function renderActivePage() {
    switch (activePage) {
      case "analytics":
        return renderAnalytics();

      case "records":
        return renderRecords();

      case "settings":
        return renderSettings();

      case "dashboard":
      default:
        return renderDashboard();
    }
  }

  /* --------------------------------
     MAIN UI
  -------------------------------- */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        activePage={activePage}
        onPageChange={(page) => {
          setActivePage(page);

          // Clear filters when changing section
          setFilter("All");

          // Keep search if user wants global search
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          search={search}
          onSearchChange={setSearch}
          pageTitle={pageTitles[activePage]}
          onAdminLoginClick={() =>
            router.push("/admin")
          }
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

