import { formatJpy, formatNumber, formatUsd } from "@/shared/lib/format";
import type { Holding } from "../types";
import { CATEGORY_COLORS } from "../lib/constants";

interface HoldingItemProps {
  readonly holding: Holding;
  readonly jpyValue: number;
  readonly onEdit: (holding: Holding) => void;
  readonly onDelete: (id: string) => void;
}

export function HoldingItem({ holding, jpyValue, onEdit, onDelete }: HoldingItemProps): React.JSX.Element {
  const value = holding.quantity * holding.pricePerUnit;
  const formattedValue = holding.currency === "JPY" ? formatJpy(value) : formatUsd(value);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[holding.category] }} />
        <div>
          <div className="text-sm font-medium">{holding.name}</div>
          <div className="text-xs text-gray-500">
            {formatNumber(holding.quantity)} x {holding.currency === "JPY" ? formatJpy(holding.pricePerUnit) : formatUsd(holding.pricePerUnit)}
            {holding.symbol ? ` (${holding.symbol})` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">{formattedValue}</div>
          {holding.currency !== "JPY" && <div className="text-xs text-gray-400">{formatJpy(jpyValue)}</div>}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => {
              onEdit(holding);
            }}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete "${holding.name}"?`)) {
                onDelete(holding.id);
              }
            }}
            className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
