import type { Holding } from "../types";

const VALID_CATEGORIES = new Set<string>(["cash", "stock", "crypto", "bond", "other"]);
const VALID_CURRENCIES = new Set<string>(["JPY", "USD"]);

interface AssetsPayload {
  readonly v: number;
  readonly holdings: readonly Holding[];
}

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

export function encodeHoldings(holdings: readonly Holding[]): string {
  const payload: AssetsPayload = { v: 1, holdings };
  return JSON.stringify(payload, null, 2);
}

export function decodeHoldings(body: string | null): readonly Holding[] {
  if (!body) return [];
  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed !== "object" || parsed === null) return [];
    const obj = parsed as Record<string, unknown>;

    if (obj["v"] !== 1) {
      console.warn(`Unknown assets payload version: ${String(obj["v"])}`);
      return [];
    }

    const rawHoldings = obj["holdings"];
    if (!Array.isArray(rawHoldings)) return [];

    const valid = rawHoldings.filter(isHolding);
    if (valid.length !== rawHoldings.length) {
      console.warn(`Filtered out ${String(rawHoldings.length - valid.length)} invalid holding(s) from issue body`);
    }
    return valid;
  } catch {
    console.warn("Failed to parse assets issue body");
    return [];
  }
}
