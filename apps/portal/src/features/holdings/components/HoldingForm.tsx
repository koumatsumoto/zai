import { type SyntheticEvent, useState } from "react";
import type { AssetCategory, Currency, Holding, HoldingInput } from "../types";
import { CATEGORIES, CATEGORY_LABELS, CURRENCIES } from "../lib/constants";

interface HoldingFormProps {
  readonly editing?: Holding | undefined;
  readonly onSubmit: (input: HoldingInput) => void;
  readonly onCancel?: (() => void) | undefined;
}

export function HoldingForm({ editing, onSubmit, onCancel }: HoldingFormProps): React.JSX.Element {
  const [name, setName] = useState(editing?.name ?? "");
  const [category, setCategory] = useState<AssetCategory>(editing?.category ?? "cash");
  const [currency, setCurrency] = useState<Currency>(editing?.currency ?? "JPY");
  const [quantity, setQuantity] = useState(editing?.quantity.toString() ?? "");
  const [pricePerUnit, setPricePerUnit] = useState(editing?.pricePerUnit.toString() ?? "");
  const [symbol, setSymbol] = useState(editing?.symbol ?? "");
  const [note, setNote] = useState(editing?.note ?? "");

  function handleSubmit(e: SyntheticEvent): void {
    e.preventDefault();
    const qty = Number(quantity);
    const price = Number(pricePerUnit);
    if (!name.trim() || isNaN(qty) || isNaN(price) || qty < 0 || price < 0) return;

    onSubmit({
      name: name.trim(),
      category,
      currency,
      quantity: qty,
      pricePerUnit: price,
      symbol: symbol.trim() || undefined,
      note: note.trim() || undefined,
    });

    if (!editing) {
      setName("");
      setCategory("cash");
      setCurrency("JPY");
      setQuantity("");
      setPricePerUnit("");
      setSymbol("");
      setNote("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="e.g. 三菱UFJ 普通預金"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as AssetCategory);
            }}
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Currency</label>
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value as Currency);
            }}
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            placeholder="0"
            step="any"
            min="0"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Price / Unit</label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => {
              setPricePerUnit(e.target.value);
            }}
            placeholder="1"
            step="any"
            min="0"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Symbol (optional)</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
            placeholder="e.g. AAPL, BTC"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            placeholder="memo"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          {editing ? "Update" : "Add"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
