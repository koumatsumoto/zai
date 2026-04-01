import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@koumatsumoto/gh-auth-bridge-client/react";
import type { Holding, HoldingInput } from "../types";
import { fetchHoldings, saveHoldings } from "../lib/github-api";
import { ensureRepository } from "../lib/repo-init";
import { createHolding } from "../lib/storage";

const HOLDINGS_QUERY_KEY = ["holdings"] as const;

interface UseHoldingsReturn {
  readonly holdings: readonly Holding[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly add: (input: HoldingInput) => void;
  readonly update: (id: string, updates: Partial<HoldingInput>) => void;
  readonly remove: (id: string) => void;
  readonly isSaving: boolean;
}

export function useHoldings(): UseHoldingsReturn {
  const { state } = useAuth();
  const login = state.user?.login;
  const queryClient = useQueryClient();

  const {
    data: holdings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: HOLDINGS_QUERY_KEY,
    queryFn: async (): Promise<readonly Holding[]> => {
      if (!login) return [];
      await ensureRepository(login);
      return fetchHoldings(login);
    },
    enabled: !!login,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: async (nextHoldings: readonly Holding[]) => {
      if (!login) throw new Error("Not authenticated");
      await saveHoldings(login, nextHoldings);
    },
    onMutate: async (nextHoldings: readonly Holding[]) => {
      await queryClient.cancelQueries({ queryKey: HOLDINGS_QUERY_KEY });
      const previous = queryClient.getQueryData<readonly Holding[]>(HOLDINGS_QUERY_KEY);
      queryClient.setQueryData(HOLDINGS_QUERY_KEY, nextHoldings);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(HOLDINGS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: HOLDINGS_QUERY_KEY });
    },
  });

  const getLatest = useCallback((): readonly Holding[] => queryClient.getQueryData<readonly Holding[]>(HOLDINGS_QUERY_KEY) ?? [], [queryClient]);

  const add = useCallback(
    (input: HoldingInput) => {
      mutation.mutate([...getLatest(), createHolding(input)]);
    },
    [getLatest, mutation],
  );

  const update = useCallback(
    (id: string, updates: Partial<HoldingInput>) => {
      mutation.mutate(getLatest().map((h) => (h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h)));
    },
    [getLatest, mutation],
  );

  const remove = useCallback(
    (id: string) => {
      mutation.mutate(getLatest().filter((h) => h.id !== id));
    },
    [getLatest, mutation],
  );

  return { holdings, isLoading, error, add, update, remove, isSaving: mutation.isPending };
}
