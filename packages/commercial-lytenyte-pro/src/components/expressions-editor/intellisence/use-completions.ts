import { useState, useCallback, useRef } from "react";
import type { CompletionItem, WordAtCursor } from "../types.js";
import { filterCompletionsByPrefix } from "./filter-completions-by-prefix.js";
import type { Token } from "../../../expressions/lexer/types.js";

type CompletionState = {
  items: CompletionItem[];
  filteredItems: CompletionItem[];
  selectedIndex: number;
  isOpen: boolean;
  isLoading: boolean;
};

export function useCompletions(
  completionProvider?: (
    tokens: Token[],
    cursorPosition: number,
  ) => CompletionItem[] | Promise<CompletionItem[]>,
) {
  const [state, setState] = useState<CompletionState>({
    items: [],
    filteredItems: [],
    selectedIndex: 0,
    isOpen: false,
    isLoading: false,
  });
  const requestIdRef = useRef(0);

  const fetchCompletions = useCallback(
    async (tokens: Token[], cursorPosition: number, word: WordAtCursor) => {
      if (!completionProvider) return;

      const requestId = ++requestIdRef.current;

      setState((prev) => ({ ...prev, isLoading: true, isOpen: true }));

      try {
        const result = await Promise.resolve(completionProvider(tokens, cursorPosition));

        if (requestId !== requestIdRef.current) return;

        const filtered = filterCompletionsByPrefix(result, word.word);

        setState({
          items: result,
          filteredItems: filtered,
          selectedIndex: 0,
          isOpen: filtered.length > 0,
          isLoading: false,
        });
      } catch {
        if (requestId !== requestIdRef.current) return;

        setState((prev) => ({
          ...prev,
          isOpen: false,
          isLoading: false,
        }));
      }
    },
    [completionProvider],
  );

  const updateFilter = useCallback((prefix: string) => {
    setState((prev) => {
      const filtered = filterCompletionsByPrefix(prev.items, prefix);
      return {
        ...prev,
        filteredItems: filtered,
        selectedIndex: 0,
        isOpen: filtered.length > 0,
      };
    });
  }, []);

  const navigate = useCallback((direction: "up" | "down") => {
    setState((prev) => {
      if (prev.filteredItems.length === 0) return prev;

      const delta = direction === "down" ? 1 : -1;
      const count = prev.filteredItems.length;
      const nextIndex = (prev.selectedIndex + delta + count) % count;

      return { ...prev, selectedIndex: nextIndex };
    });
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      selectedIndex: 0,
    }));
  }, []);

  const selectedItem =
    state.isOpen && state.filteredItems.length > 0 ? state.filteredItems[state.selectedIndex] : null;

  return {
    ...state,
    selectedItem,
    fetchCompletions,
    updateFilter,
    navigate,
    dismiss,
  };
}
