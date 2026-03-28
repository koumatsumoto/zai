import { describe, it, expect, beforeEach } from "vitest";
import { addHolding, createHolding, deleteHolding, loadHoldings, saveHoldings, updateHolding } from "@/features/holdings/lib/storage";
import type { Holding, HoldingInput } from "@/features/holdings/types";

const sampleInput: HoldingInput = {
  name: "Test Cash",
  category: "cash",
  currency: "JPY",
  quantity: 1000000,
  pricePerUnit: 1,
};

function firstHolding(holdings: readonly Holding[]): Holding {
  const h = holdings[0];
  if (!h) throw new Error("Expected at least one holding");
  return h;
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadHoldings", () => {
    it("returns empty array when no data", () => {
      expect(loadHoldings()).toEqual([]);
    });

    it("returns empty array on invalid JSON", () => {
      localStorage.setItem("zai:holdings", "invalid");
      expect(loadHoldings()).toEqual([]);
    });

    it("returns empty array when JSON is not an array", () => {
      localStorage.setItem("zai:holdings", '{"id":"1"}');
      expect(loadHoldings()).toEqual([]);
    });

    it("filters out malformed objects from valid JSON array", () => {
      localStorage.setItem("zai:holdings", '[{"id":1},{"bad":"data"}]');
      expect(loadHoldings()).toEqual([]);
    });

    it("filters out holdings with non-finite quantity", () => {
      const holding = createHolding(sampleInput);
      const corrupted = { ...holding, quantity: NaN };
      localStorage.setItem("zai:holdings", JSON.stringify([holding, corrupted]));
      const result = loadHoldings();
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(holding.id);
    });

    it("filters out holdings with unknown category", () => {
      const holding = createHolding(sampleInput);
      const corrupted = { ...holding, id: "bad-cat", category: "unknown" };
      localStorage.setItem("zai:holdings", JSON.stringify([holding, corrupted]));
      const result = loadHoldings();
      expect(result).toHaveLength(1);
    });

    it("returns saved holdings", () => {
      const holding = createHolding(sampleInput);
      saveHoldings([holding]);
      expect(loadHoldings()).toEqual([holding]);
    });
  });

  describe("addHolding", () => {
    it("adds a new holding", () => {
      const result = addHolding([], sampleInput);
      expect(result).toHaveLength(1);
      expect(firstHolding(result).name).toBe("Test Cash");
      expect(firstHolding(result).id).toBeDefined();
      expect(firstHolding(result).createdAt).toBeDefined();
    });

    it("persists to localStorage", () => {
      addHolding([], sampleInput);
      expect(loadHoldings()).toHaveLength(1);
    });
  });

  describe("updateHolding", () => {
    it("updates an existing holding", () => {
      const holdings = addHolding([], sampleInput);
      const id = firstHolding(holdings).id;
      const updated = updateHolding(holdings, id, { quantity: 2000000 });
      expect(firstHolding(updated).quantity).toBe(2000000);
      expect(firstHolding(updated).name).toBe("Test Cash");
    });

    it("sets updatedAt on update", () => {
      const holdings = addHolding([], sampleInput);
      const id = firstHolding(holdings).id;
      const updated = updateHolding(holdings, id, { quantity: 2000000 });
      expect(firstHolding(updated).updatedAt).toBeDefined();
      expect(typeof firstHolding(updated).updatedAt).toBe("string");
    });
  });

  describe("deleteHolding", () => {
    it("removes a holding", () => {
      const holdings = addHolding([], sampleInput);
      const id = firstHolding(holdings).id;
      const result = deleteHolding(holdings, id);
      expect(result).toHaveLength(0);
    });

    it("persists deletion to localStorage", () => {
      const holdings = addHolding([], sampleInput);
      const id = firstHolding(holdings).id;
      deleteHolding(holdings, id);
      expect(loadHoldings()).toHaveLength(0);
    });
  });

  describe("createHolding", () => {
    it("generates unique IDs", () => {
      const a = createHolding(sampleInput);
      const b = createHolding(sampleInput);
      expect(a.id).not.toBe(b.id);
    });

    it("preserves optional fields", () => {
      const holding: Holding = createHolding({ ...sampleInput, symbol: "JPY", note: "test note" });
      expect(holding.symbol).toBe("JPY");
      expect(holding.note).toBe("test note");
    });
  });
});
