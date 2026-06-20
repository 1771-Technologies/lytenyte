import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";

export interface AnimatingRowsContextValue {
  readonly animatingIds: Set<string>;
  readonly startAnimating: (id: string) => void;
  readonly stopAnimating: (id: string) => void;
}

const EMPTY = new Set<string>();

const context = createContext<AnimatingRowsContextValue>({
  animatingIds: EMPTY,
  startAnimating: () => {},
  stopAnimating: () => {},
});

export function AnimatingRowsProvider({ children }: PropsWithChildren) {
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(EMPTY);

  const startAnimating = useCallback((id: string) => {
    setAnimatingIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const stopAnimating = useCallback((id: string) => {
    setAnimatingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo<AnimatingRowsContextValue>(
    () => ({ animatingIds, startAnimating, stopAnimating }),
    [animatingIds, startAnimating, stopAnimating],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export const useAnimatingRowsContext = () => useContext(context);
