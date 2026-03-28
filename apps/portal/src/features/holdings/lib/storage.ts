import { HOLDINGS_KEY } from "@/shared/lib/storage-keys";
import type { Holding, HoldingInput } from "../types";

const VALID_CATEGORIES = new Set<string>(["cash", "stock", "crypto", "bond", "other"]);
const VALID_CURRENCIES = new Set<string>(["JPY", "USD"]);

function isHolding(value: unknown): value is Holding {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj["id"] === "string" &&
    typeof obj["name"] === "string" &&
    typeof obj["category"] === "string" &&
    VALID_CATEGORIES.has(obj["category"]) &&
    typeof obj["currency"] === "string" &&
    VALID_CURRENCIES.has(obj["currency"]) &&
    typeof obj["quantity"] === "number" &&
    Number.isFinite(obj["quantity"]) &&
    typeof obj["pricePerUnit"] === "number" &&
    Number.isFinite(obj["pricePerUnit"]) &&
    typeof obj["createdAt"] === "string" &&
    typeof obj["updatedAt"] === "string" &&
    (obj["symbol"] === undefined || typeof obj["symbol"] === "string") &&
    (obj["note"] === undefined || typeof obj["note"] === "string")
  );
}

function parseHoldings(raw: string): readonly Holding[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  const valid = parsed.filter(isHolding);
  if (valid.length !== parsed.length) {
    console.warn(`Filtered out ${String(parsed.length - valid.length)} invalid holding(s) from localStorage`);
  }
  return valid;
}

export function loadHoldings(): readonly Holding[] {
  try {
    const raw = localStorage.getItem(HOLDINGS_KEY);
    if (!raw) return [];
    return parseHoldings(raw);
  } catch {
    return [];
  }
}

export function saveHoldings(holdings: readonly Holding[]): void {
  localStorage.setItem(HOLDINGS_KEY, JSON.stringify(holdings));
}

export function createHolding(input: HoldingInput): Holding {
  const now = new Date().toISOString();
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

export function addHolding(holdings: readonly Holding[], input: HoldingInput): readonly Holding[] {
  const next = [...holdings, createHolding(input)];
  saveHoldings(next);
  return next;
}

export function updateHolding(holdings: readonly Holding[], id: string, updates: Partial<HoldingInput>): readonly Holding[] {
  const next = holdings.map((h) => (h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h));
  saveHoldings(next);
  return next;
}

export function deleteHolding(holdings: readonly Holding[], id: string): readonly Holding[] {
  const next = holdings.filter((h) => h.id !== id);
  saveHoldings(next);
  return next;
}

export function holdingValueJpy(holding: Holding, usdJpyRate: number): number {
  const value = holding.quantity * holding.pricePerUnit;
  return holding.currency === "USD" ? value * usdJpyRate : value;
}
