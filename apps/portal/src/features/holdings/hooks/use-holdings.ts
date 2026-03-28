import { useCallback, useState } from "react";
import type { Holding, HoldingInput } from "../types";
import { addHolding, deleteHolding, loadHoldings, updateHolding } from "../lib/storage";

interface UseHoldingsReturn {
  readonly holdings: readonly Holding[];
  readonly add: (input: HoldingInput) => void;
  readonly update: (id: string, updates: Partial<HoldingInput>) => void;
  readonly remove: (id: string) => void;
}

export function useHoldings(): UseHoldingsReturn {
  const [holdings, setHoldings] = useState<readonly Holding[]>(loadHoldings);

  const add = useCallback((input: HoldingInput) => {
    setHoldings((prev) => addHolding(prev, input));
  }, []);

  const update = useCallback((id: string, updates: Partial<HoldingInput>) => {
    setHoldings((prev) => updateHolding(prev, id, updates));
  }, []);

  const remove = useCallback((id: string) => {
    setHoldings((prev) => deleteHolding(prev, id));
  }, []);

  return { holdings, add, update, remove };
}
