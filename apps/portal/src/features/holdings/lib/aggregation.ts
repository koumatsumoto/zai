import type { AssetCategory, CategorySummary, Holding, PortfolioSummary } from "../types";
import { holdingValueJpy } from "./storage";

export function computePortfolioSummary(holdings: readonly Holding[], usdJpyRate: number): PortfolioSummary {
  const grouped = new Map<AssetCategory, Holding[]>();
  for (const h of holdings) {
    const list = grouped.get(h.category);
    if (list) {
      list.push(h);
    } else {
      grouped.set(h.category, [h]);
    }
  }

  let totalJpy = 0;
  const categorySummaries: CategorySummary[] = [];

  for (const [category, items] of grouped) {
    let catTotal = 0;
    for (const h of items) {
      catTotal += holdingValueJpy(h, usdJpyRate);
    }
    totalJpy += catTotal;
    categorySummaries.push({
      category,
      totalJpy: catTotal,
      percentage: 0,
      holdings: items,
    });
  }

  const categories: readonly CategorySummary[] = categorySummaries
    .map((c) => ({
      ...c,
      percentage: totalJpy > 0 ? (c.totalJpy / totalJpy) * 100 : 0,
    }))
    .sort((a, b) => b.totalJpy - a.totalJpy);

  const cashTotal = categories.find((c) => c.category === "cash")?.totalJpy ?? 0;
  const cashRatio = totalJpy > 0 ? (cashTotal / totalJpy) * 100 : 0;

  return {
    totalJpy,
    categories,
    cashRatio,
    investedRatio: 100 - cashRatio,
  };
}
