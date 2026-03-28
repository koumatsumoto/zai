const jpyFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const numberFormatter = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 4 });
const percentFormatter = new Intl.NumberFormat("ja-JP", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatJpy(value: number): string {
  return jpyFormatter.format(value);
}

export function formatUsd(value: number): string {
  return usdFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio / 100);
}
