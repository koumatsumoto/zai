import { describe, it, expect } from "vitest";
import { createHolding, holdingValueJpy } from "@/features/holdings/lib/storage";
import type { HoldingInput } from "@/features/holdings/types";

const sampleInput: HoldingInput = {
  name: "Test Cash",
  category: "cash",
  currency: "JPY",
  quantity: 1000000,
  pricePerUnit: 1,
};

describe("createHolding", () => {
  it("generates unique IDs", () => {
    const a = createHolding(sampleInput);
    const b = createHolding(sampleInput);
    expect(a.id).not.toBe(b.id);
  });

  it("sets createdAt and updatedAt", () => {
    const holding = createHolding(sampleInput);
    expect(holding.createdAt).toBeDefined();
    expect(holding.updatedAt).toBeDefined();
    expect(holding.createdAt).toBe(holding.updatedAt);
  });

  it("preserves input fields", () => {
    const holding = createHolding(sampleInput);
    expect(holding.name).toBe("Test Cash");
    expect(holding.category).toBe("cash");
    expect(holding.currency).toBe("JPY");
    expect(holding.quantity).toBe(1000000);
    expect(holding.pricePerUnit).toBe(1);
  });

  it("preserves optional fields", () => {
    const holding = createHolding({ ...sampleInput, symbol: "JPY", note: "test note" });
    expect(holding.symbol).toBe("JPY");
    expect(holding.note).toBe("test note");
  });

  it("leaves optional fields undefined when not provided", () => {
    const holding = createHolding(sampleInput);
    expect(holding.symbol).toBeUndefined();
    expect(holding.note).toBeUndefined();
  });
});

describe("holdingValueJpy", () => {
  it("returns JPY value directly for JPY holdings", () => {
    const holding = createHolding({ ...sampleInput, currency: "JPY", quantity: 500000, pricePerUnit: 1 });
    expect(holdingValueJpy(holding, 150)).toBe(500000);
  });

  it("converts USD to JPY using rate", () => {
    const holding = createHolding({ ...sampleInput, currency: "USD", quantity: 10, pricePerUnit: 200 });
    expect(holdingValueJpy(holding, 150)).toBe(10 * 200 * 150);
  });

  it("handles zero quantity", () => {
    const holding = createHolding({ ...sampleInput, quantity: 0, pricePerUnit: 100 });
    expect(holdingValueJpy(holding, 150)).toBe(0);
  });
});
