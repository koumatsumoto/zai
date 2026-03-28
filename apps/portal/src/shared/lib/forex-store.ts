import { FOREX_RATE_KEY } from "./storage-keys";

const DEFAULT_USD_JPY = 150;

export function loadUsdJpyRate(): number {
  try {
    const raw = localStorage.getItem(FOREX_RATE_KEY);
    if (!raw) return DEFAULT_USD_JPY;
    const rate = Number(raw);
    return isNaN(rate) || rate <= 0 ? DEFAULT_USD_JPY : rate;
  } catch {
    return DEFAULT_USD_JPY;
  }
}

export function saveUsdJpyRate(rate: number): void {
  localStorage.setItem(FOREX_RATE_KEY, String(rate));
}
