import { useCallback, useState } from "react";
import type { Holding, HoldingInput } from "@/features/holdings/types";
import { useHoldings } from "@/features/holdings/hooks/use-holdings";
import { HoldingForm } from "@/features/holdings/components/HoldingForm";
import { HoldingList } from "@/features/holdings/components/HoldingList";
import { loadUsdJpyRate, saveUsdJpyRate } from "@/shared/lib/forex-store";
import { RepoNotConfiguredError } from "@/shared/lib/errors";
import { REPO_NAME } from "@/features/holdings/lib/repo-constants";

export function HoldingsPage(): React.JSX.Element {
  const { holdings, isLoading, error, add, update, remove, isSaving } = useHoldings();
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

  if (isLoading) {
    return (
      <div className="space-y-3 py-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error instanceof RepoNotConfiguredError) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Repository &quot;{REPO_NAME}&quot; not found.</p>
        <a
          href={`https://github.com/new?name=${REPO_NAME}&visibility=private`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create {REPO_NAME}
        </a>
        <p className="mt-2 text-xs text-gray-400">Create a private repository, then reload this page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">Failed to load holdings</p>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Holdings</h2>
          {isSaving && <span className="text-xs text-gray-400">Saving...</span>}
        </div>
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
