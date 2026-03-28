import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useRowCountsContext } from "./row-counts-context.js";
import { useXCoordinates, useYCoordinates } from "../coordinates.js";
import { useHeaderLayoutContext } from "../header-layout.js";
import { useColumnsContext } from "../columns/column-context.js";

interface Offset {
  readonly startOffset: number;
  readonly endOffset: number;
  readonly bottomOffset: number;
  readonly topOffset: number;
  readonly headerHeight: number;
}

const context = createContext(null as unknown as Offset);

export const OffsetProvider = memo((props: PropsWithChildren) => {
  const { view } = useColumnsContext();
  const { rowCount, topCount, bottomCount } = useRowCountsContext();
  const { totalHeaderHeight } = useHeaderLayoutContext();
  const yPositions = useYCoordinates();
  const xPositions = useXCoordinates();

  const value = useMemo<Offset>(() => {
    const topOffset = yPositions[topCount] + totalHeaderHeight;
    const bottomOffset = yPositions.at(-1)! - yPositions[rowCount - bottomCount];

    const startOffset = xPositions[view.startCount];
    const endOffset = xPositions.at(-1)! - xPositions[view.centerCount + view.startCount];

    return {
      topOffset,
      bottomOffset,
      startOffset,
      endOffset,
      headerHeight: totalHeaderHeight,
    };
  }, [
    bottomCount,
    rowCount,
    topCount,
    totalHeaderHeight,
    view.centerCount,
    view.startCount,
    xPositions,
    yPositions,
  ]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useOffsetContext = () => useContext(context);
