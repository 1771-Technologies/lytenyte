import { useMemo, type PropsWithChildren } from "react";
import { context, type SortManagerContext } from "./context.js";

export function Root({
  sortItems,
  setSortItems,
  grid,
  mode,
  children,
}: PropsWithChildren<SortManagerContext>) {
  const value = useMemo(() => {
    return {
      sortItems,
      setSortItems,
      grid,
      mode,
    };
  }, [grid, mode, setSortItems, sortItems]);

  return <context.Provider value={value}>{children}</context.Provider>;
}
