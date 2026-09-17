import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "indigo" | "emerald" | "amber" | "sky";
  trend?: string;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600"
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "indigo",
  trend
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${accentStyles[accent]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton mt-3 h-7 w-16 rounded" />
    </div>
  );
}
