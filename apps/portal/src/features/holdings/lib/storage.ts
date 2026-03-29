import type { Holding, HoldingInput } from "../types";

export function createHolding(input: HoldingInput): Holding {
  const now = new Date().toISOString();
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

export function holdingValueJpy(holding: Holding, usdJpyRate: number): number {
  const value = holding.quantity * holding.pricePerUnit;
  return holding.currency === "USD" ? value * usdJpyRate : value;
}
