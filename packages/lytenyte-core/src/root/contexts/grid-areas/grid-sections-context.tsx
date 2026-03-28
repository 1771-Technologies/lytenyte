import type { GridSections } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useOffsetContext } from "./offset-context.js";
import { useCutoffContext } from "./cutoff-context.js";
import { useRowCountsContext } from "./row-counts-context.js";
import { useColumnsContext } from "../columns/column-context.js";

const context = createContext(null as unknown as GridSections);

export const GridSectionsContextProvider = memo((props: PropsWithChildren) => {
  const offsets = useOffsetContext();
  const cutoffs = useCutoffContext();
  const counts = useRowCountsContext();
  const { view } = useColumnsContext();

  const value = useMemo<GridSections>(() => {
    return {
      startCount: view.startCount,
      colCenterCount: view.centerCount,
      endCount: view.endCount,

      ...offsets,
      ...cutoffs,
      ...counts,
      topRowOffset: offsets.topOffset - offsets.headerHeight,
    } satisfies GridSections;
  }, [counts, cutoffs, offsets, view.centerCount, view.endCount, view.startCount]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridSectionsContext = () => useContext(context);
