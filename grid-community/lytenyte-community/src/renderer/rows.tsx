import { useMemo, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { END_ENCODING, FULL_ENCODING } from "@1771technologies/grid-constants";
import { Cell } from "./cell";
import { CellFullWidth } from "./cell-full-width";

export function Rows() {
  const state = useGrid().state;

  const layout = state.internal.virtLayout.use();

  const xPositions = state.internal.columnPositions.use();
  const yPositions = state.internal.rowPositions.use();

  const [fullWidthCache, cellCache] = useMemo(() => {
    void xPositions;
    void yPositions;

    return [{}, {}] as [Record<number, ReactNode>, Record<number, Record<number, ReactNode>>];
  }, [xPositions, yPositions]);

  const rowCount = state.internal.rowCount.use();

  const cells = useMemo(() => {
    const els: ReactNode[] = [];

    for (const [rowIndex, cells] of layout) {
      // We have to ensure the layout never exceeds the row count. The layout can temporarily exceed
      // the row count when the number of rows changes.
      if (rowIndex >= rowCount) continue;

      let i = 0;
      while (i < cells.length) {
        const encoding = cells[i];

        if (encoding === FULL_ENCODING) {
          fullWidthCache[rowIndex] ??= (
            <CellFullWidth key={`${rowIndex}-full`} rowIndex={rowIndex} yPositions={yPositions} />
          );

          els.push(fullWidthCache[rowIndex]);
          i++;
        } else if (encoding === END_ENCODING) {
          break;
        } else {
          const rowIndex = cells[i++];
          const rowSpan = cells[i++];
          const colIndex = cells[i++];
          const colSpan = cells[i++];

          cellCache[rowIndex] ??= {};
          cellCache[rowIndex][colIndex] = (
            <Cell
              key={`r${rowIndex}-c${colIndex}`}
              rowIndex={rowIndex}
              rowSpan={rowSpan}
              colSpan={colSpan}
              columnIndex={colIndex}
              yPositions={yPositions}
              xPositions={xPositions}
            />
          );
          els.push(cellCache[rowIndex][colIndex]);
        }
      }
    }

    return els;
  }, [cellCache, fullWidthCache, layout, rowCount, xPositions, yPositions]);

  return <>{cells}</>;
}
