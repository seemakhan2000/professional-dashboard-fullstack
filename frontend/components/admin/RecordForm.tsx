"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { DashboardRecord, DashboardRecordInput, RecordStatus } from "@/types/dashboard";

interface RecordFormProps {
  initialRecord?: DashboardRecord | null;
  onCancel: () => void;
  onSubmit: (data: DashboardRecordInput) => Promise<void>;
}

const statusOptions: RecordStatus[] = ["Active", "Pending", "Inactive"];

export default function RecordForm({
  initialRecord,
  onCancel,
  onSubmit
}: RecordFormProps) {
  const isEdit = Boolean(initialRecord);

  const [name, setName] = useState(initialRecord?.name ?? "");
  const [category, setCategory] = useState(initialRecord?.category ?? "");
  const [value, setValue] = useState(
    initialRecord ? String(initialRecord.value) : ""
  );
  const [status, setStatus] = useState<RecordStatus>(
    initialRecord?.status ?? "Active"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!category.trim()) nextErrors.category = "Category is required.";
    if (value === "" || isNaN(Number(value)) || Number(value) < 0) {
      nextErrors.value = "Enter a valid non-negative number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      value: Number(value),
      status
    });
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Record" : "Add Record"}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. Cloud Infrastructure Upgrade"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. Technology"
            />
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. 48200"
            />
            {errors.value && (
              <p className="mt-1 text-xs text-red-600">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RecordStatus)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Add Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
