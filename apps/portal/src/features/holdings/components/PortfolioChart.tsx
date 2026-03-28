import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatJpy, formatPercent } from "@/shared/lib/format";
import type { CategorySummary } from "../types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/constants";

interface PortfolioChartProps {
  readonly categories: readonly CategorySummary[];
  readonly totalJpy: number;
}

interface ChartEntry {
  readonly name: string;
  readonly value: number;
  readonly color: string;
}

function toChartData(categories: readonly CategorySummary[]): ChartEntry[] {
  return categories.map((c) => ({
    name: CATEGORY_LABELS[c.category],
    value: c.totalJpy,
    color: CATEGORY_COLORS[c.category],
  }));
}

function CustomTooltip({
  active,
  payload,
}: {
  readonly active?: boolean;
  readonly payload?: readonly { payload: ChartEntry }[];
}): React.JSX.Element | null {
  if (!active || !payload?.[0]) return null;
  const entry = payload[0].payload;
  return (
    <div className="rounded border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <div className="font-medium">{entry.name}</div>
      <div className="text-gray-600">{formatJpy(entry.value)}</div>
    </div>
  );
}

export function PortfolioChart({ categories, totalJpy }: PortfolioChartProps): React.JSX.Element {
  const data = toChartData(categories);

  if (data.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">No data to display.</p>;
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-lg font-bold">{formatJpy(totalJpy)}</div>
        </div>
      </div>
    </div>
  );
}

export function CategoryBreakdown({ categories }: { readonly categories: readonly CategorySummary[] }): React.JSX.Element {
  return (
    <div className="space-y-2">
      {categories.map((c) => (
        <div key={c.category} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.category] }} />
            <span className="text-sm font-medium">{CATEGORY_LABELS[c.category]}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium">{formatJpy(c.totalJpy)}</span>
            <span className="ml-2 text-xs text-gray-400">{formatPercent(c.percentage)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
