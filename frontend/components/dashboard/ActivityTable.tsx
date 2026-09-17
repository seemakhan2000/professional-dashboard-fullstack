"use client";

import { Pencil, Trash2, Inbox } from "lucide-react";
import { DashboardRecord } from "@/types/dashboard";

interface ActivityTableProps {
  records: DashboardRecord[];
  isAdmin?: boolean;
  onEdit?: (record: DashboardRecord) => void;
  onDelete?: (record: DashboardRecord) => void;
}

const statusBadge: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Inactive: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200"
};

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default function ActivityTable({
  records,
  isAdmin = false,
  onEdit,
  onDelete
}: ActivityTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {isAdmin ? "Records" : "Recent Activity"}
        </h3>
        <span className="text-xs text-gray-400">{records.length} results</span>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Value</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
              {isAdmin && <th className="px-5 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-5 py-10">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Inbox size={28} />
                    <p className="text-sm">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{record.category}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {formatCurrency(record.value)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit?.(record)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                          aria-label={`Edit ${record.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onDelete?.(record)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${record.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActivityTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="skeleton h-4 w-32 rounded" />
      <div className="mt-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-8 w-full rounded" />
        ))}
      </div>
    </div>
  );
}
