import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useHoldings } from "@/features/holdings/hooks/use-holdings";
import { computePortfolioSummary } from "@/features/holdings/lib/aggregation";
import { CategoryBreakdown, PortfolioChart } from "@/features/holdings/components/PortfolioChart";
import { formatJpy, formatPercent } from "@/shared/lib/format";
import { loadUsdJpyRate } from "@/shared/lib/forex-store";

export function DashboardPage(): React.JSX.Element {
  const { holdings } = useHoldings();
  const [usdJpyRate] = useState(loadUsdJpyRate);
  const summary = useMemo(() => computePortfolioSummary(holdings, usdJpyRate), [holdings, usdJpyRate]);

  if (holdings.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">No holdings yet.</p>
        <Link to="/holdings" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Add your first asset
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>

      <PortfolioChart categories={summary.categories} totalJpy={summary.totalJpy} />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Cash</div>
          <div className="mt-1 text-lg font-bold text-green-600">{formatPercent(summary.cashRatio)}</div>
          <div className="text-xs text-gray-400">{formatJpy(summary.categories.find((c) => c.category === "cash")?.totalJpy ?? 0)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Invested</div>
          <div className="mt-1 text-lg font-bold text-blue-600">{formatPercent(summary.investedRatio)}</div>
          <div className="text-xs text-gray-400">
            {formatJpy(summary.totalJpy - (summary.categories.find((c) => c.category === "cash")?.totalJpy ?? 0))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">By Category</h3>
        <CategoryBreakdown categories={summary.categories} />
      </div>

      <div className="text-right text-xs text-gray-400">USD/JPY: {usdJpyRate}</div>
    </div>
  );
}
