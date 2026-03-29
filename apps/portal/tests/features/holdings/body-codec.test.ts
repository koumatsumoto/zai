import { describe, it, expect } from "vitest";
import { encodeHoldings, decodeHoldings } from "@/features/holdings/lib/body-codec";
import { createHolding } from "@/features/holdings/lib/storage";
import type { Holding, HoldingInput } from "@/features/holdings/types";

function first(holdings: readonly Holding[]): Holding {
  const h = holdings[0];
  if (!h) throw new Error("Expected at least one holding");
  return h;
}

const sampleInput: HoldingInput = {
  name: "Test Cash",
  category: "cash",
  currency: "JPY",
  quantity: 1000000,
  pricePerUnit: 1,
};

describe("encodeHoldings", () => {
  it("produces valid JSON with v1 schema", () => {
    const holdings = [createHolding(sampleInput)];
    const json = encodeHoldings(holdings);
    const parsed = JSON.parse(json) as { v: number; holdings: unknown[] };
    expect(parsed.v).toBe(1);
    expect(parsed.holdings).toHaveLength(1);
  });

  it("encodes empty array", () => {
    const json = encodeHoldings([]);
    const parsed = JSON.parse(json) as { v: number; holdings: unknown[] };
    expect(parsed.v).toBe(1);
    expect(parsed.holdings).toHaveLength(0);
  });
});

describe("decodeHoldings", () => {
  it("round-trips with encodeHoldings", () => {
    const original = [createHolding(sampleInput), createHolding({ ...sampleInput, name: "Stocks", category: "stock", currency: "USD" })];
    const encoded = encodeHoldings(original);
    const decoded = decodeHoldings(encoded);
    expect(decoded).toEqual(original);
  });

  it("returns empty array for null body", () => {
    expect(decodeHoldings(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(decodeHoldings("")).toEqual([]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(decodeHoldings("not json")).toEqual([]);
  });

  it("returns empty array for non-object JSON", () => {
    expect(decodeHoldings("42")).toEqual([]);
  });

  it("returns empty array for unknown version", () => {
    expect(decodeHoldings(JSON.stringify({ v: 2, holdings: [] }))).toEqual([]);
  });

  it("returns empty array when holdings is not an array", () => {
    expect(decodeHoldings(JSON.stringify({ v: 1, holdings: "not array" }))).toEqual([]);
  });

  it("filters out invalid holdings", () => {
    const valid = createHolding(sampleInput);
    const payload = {
      v: 1,
      holdings: [valid, { id: "bad", name: 123 }, { missing: "fields" }],
    };
    const decoded = decodeHoldings(JSON.stringify(payload));
    expect(decoded).toHaveLength(1);
    expect(first(decoded).id).toBe(valid.id);
  });

  it("filters out holdings with NaN quantity", () => {
    const valid = createHolding(sampleInput);
    const corrupted = { ...valid, id: "corrupted", quantity: NaN };
    const payload = { v: 1, holdings: [valid, corrupted] };
    const decoded = decodeHoldings(JSON.stringify(payload));
    expect(decoded).toHaveLength(1);
  });

  it("filters out holdings with unknown category", () => {
    const valid = createHolding(sampleInput);
    const corrupted = { ...valid, id: "bad-cat", category: "unknown" };
    const payload = { v: 1, holdings: [valid, corrupted] };
    const decoded = decodeHoldings(JSON.stringify(payload));
    expect(decoded).toHaveLength(1);
  });

  it("preserves optional fields", () => {
    const holding = createHolding({ ...sampleInput, symbol: "AAPL", note: "NISA" });
    const encoded = encodeHoldings([holding]);
    const decoded = decodeHoldings(encoded);
    expect(first(decoded).symbol).toBe("AAPL");
    expect(first(decoded).note).toBe("NISA");
  });
});
