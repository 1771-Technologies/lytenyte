import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useRowCountsContext } from "./row-counts-context.js";
import { useColumnsContext } from "../columns/column-context.js";

interface Cutoff {
  readonly startCutoff: number;
  readonly endCutoff: number;
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly rowCount: number;
}

const context = createContext(null as unknown as Cutoff);

export const CutoffProvider = memo((props: PropsWithChildren) => {
  const { topCount, centerCount, rowCount } = useRowCountsContext();
  const { view } = useColumnsContext();

  const value = useMemo<Cutoff>(() => {
    const topCutoff = topCount;
    const bottomCutoff = centerCount + topCount;
    const startCutoff = view.startCount;
    const endCutoff = view.startCount + view.centerCount;

    return {
      topCutoff,
      bottomCutoff,
      startCutoff,
      endCutoff,
      rowCount,
    };
  }, [centerCount, rowCount, topCount, view.centerCount, view.startCount]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useCutoffContext = () => useContext(context);
