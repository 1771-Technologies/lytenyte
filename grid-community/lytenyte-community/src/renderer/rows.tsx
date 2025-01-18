import { useMemo, useRef, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { END_ENCODING, FULL_ENCODING } from "@1771technologies/grid-constants";
import { Cell } from "./cell";
import { CellFullWidth } from "./cell-full-width";

export function Rows() {
  const state = useGrid().state;

  const layout = state.internal.virtLayout.use();

  const cellCache = useRef<Record<number, Record<number, ReactNode>>>({});
  const fullWidthCache = useRef<Record<number, ReactNode>>({});

  const cells = useMemo(() => {
    const els: ReactNode[] = [];

    for (const [rowIndex, cells] of layout) {
      let i = 0;
      while (i < cells.length) {
        const encoding = cells[i];

        if (encoding === FULL_ENCODING) {
          fullWidthCache.current[rowIndex] ??= (
            <CellFullWidth key={`${rowIndex}-full`} rowIndex={rowIndex} />
          );

          els.push(fullWidthCache.current[rowIndex]);
          i++;
        } else if (encoding === END_ENCODING) {
          break;
        } else {
          const rowIndex = cells[i++];
          const rowSpan = cells[i++];
          const colIndex = cells[i++];
          const colSpan = cells[i++];

          cellCache.current[rowIndex] ??= {};
          cellCache.current[rowIndex][colIndex] = (
            <Cell
              key={`r${rowIndex}-c${colIndex}`}
              rowIndex={rowIndex}
              rowSpan={rowSpan}
              colSpan={colSpan}
              columnIndex={colIndex}
            />
          );

          els.push(cellCache.current[rowIndex][colIndex]);
        }
      }
    }

    return els;
  }, [layout]);

  return <>{cells}</>;
}
