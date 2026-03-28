import type { AssetCategory, Currency } from "../types";

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  cash: "Cash",
  stock: "Stock",
  crypto: "Crypto",
  bond: "Bond",
  other: "Other",
};

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  cash: "#4ade80",
  stock: "#60a5fa",
  crypto: "#f59e0b",
  bond: "#a78bfa",
  other: "#94a3b8",
};

export const CATEGORIES: readonly AssetCategory[] = ["cash", "stock", "crypto", "bond", "other"];

export const CURRENCIES: readonly Currency[] = ["JPY", "USD"];
