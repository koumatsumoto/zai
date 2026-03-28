export type AssetCategory = "cash" | "stock" | "crypto" | "bond" | "other";

export type Currency = "JPY" | "USD";

export interface Holding {
  readonly id: string;
  readonly name: string;
  readonly category: AssetCategory;
  readonly currency: Currency;
  readonly quantity: number;
  readonly pricePerUnit: number;
  readonly symbol?: string | undefined;
  readonly note?: string | undefined;
  readonly updatedAt: string;
  readonly createdAt: string;
}

export interface HoldingInput {
  readonly name: string;
  readonly category: AssetCategory;
  readonly currency: Currency;
  readonly quantity: number;
  readonly pricePerUnit: number;
  readonly symbol?: string | undefined;
  readonly note?: string | undefined;
}

export interface CategorySummary {
  readonly category: AssetCategory;
  readonly totalJpy: number;
  readonly percentage: number;
  readonly holdings: readonly Holding[];
}

export interface PortfolioSummary {
  readonly totalJpy: number;
  readonly categories: readonly CategorySummary[];
  readonly cashRatio: number;
  readonly investedRatio: number;
}
