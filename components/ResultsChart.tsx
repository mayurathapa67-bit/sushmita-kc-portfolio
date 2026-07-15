"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TEAL = "#0d7377";
const PURPLE = "#8b5cf6";
const PIE_COLORS = ["#0d7377", "#14a0a5", "#8b5cf6", "#a78bfa", "#1a1a1a", "#f3eee6"];

interface ChartPoint {
  label: string;
  before: number;
  after: number;
}

interface NameValue {
  name: string;
  value: number;
}

type ChartType = "line" | "bar" | "pie";

interface ResultsChartProps {
  type: ChartType;
  data: ChartPoint[] | NameValue[];
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-charcoal/10 bg-cream-50 px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-charcoal">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-charcoal/70">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: <span className="font-semibold text-charcoal">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function ResultsChart({
  type,
  data,
  height = 300,
}: ResultsChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="grid place-items-center rounded-2xl border border-dashed border-charcoal/15 text-sm text-charcoal/40"
      >
        No data available
      </div>
    );
  }

  if (type === "line") {
    const lineData = data as ChartPoint[];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={lineData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.08)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "rgba(26,26,26,0.6)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "rgba(26,26,26,0.6)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="before" name="Before" stroke={TEAL} strokeWidth={2} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="after" name="After" stroke={PURPLE} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    const barData = data as NameValue[];
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={barData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "rgba(26,26,26,0.6)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "rgba(26,26,26,0.6)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.08)" }} />
          <Bar dataKey="value" name="Value" radius={[8, 8, 0, 0]}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={i % 2 === 0 ? TEAL : PURPLE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  const pieData = data as NameValue[];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
        >
          {pieData.map((entry, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
