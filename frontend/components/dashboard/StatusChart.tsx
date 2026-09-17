"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardRecord } from "@/types/dashboard";

interface StatusChartProps {
  records: DashboardRecord[];
}

const COLORS: Record<string, string> = {
  Active: "#10b981",
  Pending: "#f59e0b",
  Inactive: "#9ca3af"
};

export default function StatusChart({ records }: StatusChartProps) {
  const counts = { Active: 0, Pending: 0, Inactive: 0 };
  records.forEach((r) => {
    counts[r.status] = (counts[r.status] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const hasData = records.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Status Distribution
        </h3>
      </div>
      <div className="h-64 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No records to display
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton mt-4 h-64 w-full rounded-lg" />
    </div>
  );
}
