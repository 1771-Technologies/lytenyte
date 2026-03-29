import type { RowSource } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";

interface Counts {
  readonly topCount: number;
  readonly centerCount: number;
  readonly bottomCount: number;
  readonly rowCount: number;
}
const context = createContext<Counts>({} as Counts);

function RowCountsProviderBase({ children, source }: PropsWithChildren<{ source: RowSource }>) {
  const topCount = source.useTopCount();
  const bottomCount = source.useBottomCount();
  const rowCount = source.useRowCount();

  const value = useMemo<Counts>(() => {
    return { topCount, bottomCount, centerCount: rowCount - topCount - bottomCount, rowCount };
  }, [bottomCount, rowCount, topCount]);

  return <context.Provider value={value}>{children}</context.Provider>;
}

export const RowCountsProvider = memo(RowCountsProviderBase);
export const useRowCountsContext = () => useContext(context);
