import { createContext, useCallback, useContext, useMemo, type PropsWithChildren } from "react";
import { useFilterManagerState } from "../filter-state-context";
import type { SemiPartialFilter } from "../types";

const context = createContext(
  {} as unknown as { value: SemiPartialFilter; onChange: (s: SemiPartialFilter) => void },
);

export function SimpleFilterRoot(props: PropsWithChildren<{ isAdditional?: boolean }>) {
  const { flatFilters, onFilterChange } = useFilterManagerState();

  const flatFilter = flatFilters[props.isAdditional ? 1 : 0];

  const semiFilter = flatFilter?.[0];

  const onChange = useCallback(
    (filter: SemiPartialFilter) => {
      const next = [...flatFilters];
      const logical = flatFilter[1];
      next[props.isAdditional ? 1 : 0] = [filter, logical] as const;

      onFilterChange(next);
    },
    [flatFilter, flatFilters, onFilterChange, props.isAdditional],
  );

  const value = useMemo(() => {
    return { value: semiFilter!, onChange };
  }, [onChange, semiFilter]);

  if (!flatFilter) return null;

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useSimpleFilterRoot = () => useContext(context);
