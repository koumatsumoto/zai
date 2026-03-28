import { useCallback, useState } from "react";
import type { Holding, HoldingInput } from "@/features/holdings/types";
import { useHoldings } from "@/features/holdings/hooks/use-holdings";
import { HoldingForm } from "@/features/holdings/components/HoldingForm";
import { HoldingList } from "@/features/holdings/components/HoldingList";
import { loadUsdJpyRate, saveUsdJpyRate } from "@/shared/lib/forex-store";

export function HoldingsPage(): React.JSX.Element {
  const { holdings, add, update, remove } = useHoldings();
  const [editing, setEditing] = useState<Holding | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [usdJpyRate, setUsdJpyRate] = useState(loadUsdJpyRate);
  const [rateInput, setRateInput] = useState(String(loadUsdJpyRate()));

  const handleAdd = useCallback(
    (input: HoldingInput) => {
      add(input);
      setShowForm(false);
    },
    [add],
  );

  const handleEdit = useCallback(
    (input: HoldingInput) => {
      if (editing) {
        update(editing.id, input);
        setEditing(null);
      }
    },
    [editing, update],
  );

  const applyRate = useCallback(() => {
    const rate = Number(rateInput);
    if (!isNaN(rate) && rate > 0) {
      setUsdJpyRate(rate);
      saveUsdJpyRate(rate);
    } else {
      setRateInput(String(usdJpyRate));
    }
  }, [rateInput, usdJpyRate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Holdings</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-gray-500">
            USD/JPY
            <input
              type="number"
              value={rateInput}
              onChange={(e) => {
                setRateInput(e.target.value);
              }}
              onBlur={applyRate}
              step="0.01"
              min="0"
              className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-xs focus:border-blue-500 focus:outline-none"
            />
          </label>
          {!showForm && !editing && (
            <button
              onClick={() => {
                setShowForm(true);
              }}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <HoldingForm
          onSubmit={handleAdd}
          onCancel={() => {
            setShowForm(false);
          }}
        />
      )}

      {editing && (
        <HoldingForm
          editing={editing}
          onSubmit={handleEdit}
          onCancel={() => {
            setEditing(null);
          }}
        />
      )}

      <HoldingList holdings={holdings} usdJpyRate={usdJpyRate} onEdit={setEditing} onDelete={remove} />
    </div>
  );
}
