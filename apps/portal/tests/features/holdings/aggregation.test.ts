import { describe, it, expect } from "vitest";
import { computePortfolioSummary } from "@/features/holdings/lib/aggregation";
import type { Holding } from "@/features/holdings/types";

function makeHolding(overrides: Partial<Holding> & Pick<Holding, "name" | "category" | "currency" | "quantity" | "pricePerUnit">): Holding {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("computePortfolioSummary", () => {
  it("returns zero totals for empty holdings", () => {
    const result = computePortfolioSummary([], 150);
    expect(result.totalJpy).toBe(0);
    expect(result.categories).toHaveLength(0);
    expect(result.cashRatio).toBe(0);
    expect(result.investedRatio).toBe(100);
  });

  it("computes JPY holdings correctly", () => {
    const holdings: readonly Holding[] = [
      makeHolding({ name: "Bank A", category: "cash", currency: "JPY", quantity: 3000000, pricePerUnit: 1 }),
      makeHolding({ name: "Bank B", category: "cash", currency: "JPY", quantity: 2000000, pricePerUnit: 1 }),
    ];
    const result = computePortfolioSummary(holdings, 150);
    expect(result.totalJpy).toBe(5000000);
    expect(result.cashRatio).toBe(100);
    expect(result.investedRatio).toBe(0);
  });

  it("converts USD holdings to JPY", () => {
    const holdings: readonly Holding[] = [makeHolding({ name: "AAPL", category: "stock", currency: "USD", quantity: 10, pricePerUnit: 200 })];
    const result = computePortfolioSummary(holdings, 150);
    expect(result.totalJpy).toBe(10 * 200 * 150);
  });

  it("computes category percentages", () => {
    const holdings: readonly Holding[] = [
      makeHolding({ name: "Cash", category: "cash", currency: "JPY", quantity: 5000000, pricePerUnit: 1 }),
      makeHolding({ name: "Stocks", category: "stock", currency: "JPY", quantity: 100, pricePerUnit: 50000 }),
    ];
    const result = computePortfolioSummary(holdings, 150);
    expect(result.totalJpy).toBe(10000000);
    expect(result.cashRatio).toBe(50);
    expect(result.investedRatio).toBe(50);
    expect(result.categories).toHaveLength(2);
  });

  it("sorts categories by total value descending", () => {
    const holdings: readonly Holding[] = [
      makeHolding({ name: "Small", category: "bond", currency: "JPY", quantity: 100000, pricePerUnit: 1 }),
      makeHolding({ name: "Large", category: "stock", currency: "JPY", quantity: 5000000, pricePerUnit: 1 }),
      makeHolding({ name: "Medium", category: "cash", currency: "JPY", quantity: 1000000, pricePerUnit: 1 }),
    ];
    const result = computePortfolioSummary(holdings, 150);
    expect(result.categories[0]?.category).toBe("stock");
    expect(result.categories[1]?.category).toBe("cash");
    expect(result.categories[2]?.category).toBe("bond");
  });

  it("handles mixed JPY and USD holdings", () => {
    const holdings: readonly Holding[] = [
      makeHolding({ name: "JPY Cash", category: "cash", currency: "JPY", quantity: 1500000, pricePerUnit: 1 }),
      makeHolding({ name: "BTC", category: "crypto", currency: "USD", quantity: 0.5, pricePerUnit: 60000 }),
    ];
    const result = computePortfolioSummary(holdings, 150);
    const expectedTotal = 1500000 + 0.5 * 60000 * 150;
    expect(result.totalJpy).toBe(expectedTotal);
  });
});
