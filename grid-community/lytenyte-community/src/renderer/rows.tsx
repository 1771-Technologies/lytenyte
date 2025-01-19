import { useMemo, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { END_ENCODING, FULL_ENCODING } from "@1771technologies/grid-constants";
import { Cell } from "./cell";
import { CellFullWidth } from "./cell-full-width";
import { t } from "@1771technologies/grid-design";

export function Rows({ width }: { width: number }) {
  const { state, api } = useGrid();

  const layout = state.internal.virtLayout.use();

  const xPositions = state.internal.columnPositions.use();
  const yPositions = state.internal.rowPositions.use();
  const columns = state.columnsVisible.use();
  const refreshKey = state.internal.rowRefreshCount.use();
  const headerHeight = state.internal.viewportHeaderHeight.use();

  const rowCount = state.internal.rowCount.use();
  const topCount = state.internal.rowTopCount.use();
  const botCount = state.internal.rowBottomCount.use();

  const topHeight = yPositions[topCount];
  const botHeight = yPositions.at(-1)! - yPositions[rowCount - botCount];

  const [fullWidthCache, cellCache] = useMemo(() => {
    void xPositions;
    void yPositions;
    void columns;
    void refreshKey;
    void rowCount;
    void topCount;
    void botCount;
    void headerHeight;

    return [{}, {}] as [Record<number, ReactNode>, Record<number, Record<number, ReactNode>>];
  }, [botCount, columns, headerHeight, refreshKey, rowCount, topCount, xPositions, yPositions]);

  const firstBotIndex = rowCount - botCount;

  const [top, center, bottom] = useMemo(() => {
    const top: ReactNode[] = [];
    const center: ReactNode[] = [];
    const bottom: ReactNode[] = [];

    for (const [rowIndex, cells] of layout) {
      // We have to ensure the layout never exceeds the row count. The layout can temporarily exceed
      // the row count when the number of rows changes.
      if (rowIndex >= rowCount) continue;

      const isTop = rowIndex < topCount;
      const isBot = rowIndex >= firstBotIndex;
      const isCenter = !isTop && !isBot;

      const place = isCenter ? center : isTop ? top : bottom;

      const row = api.rowByIndex(rowIndex);
      if (!row) continue;

      let i = 0;
      while (i < cells.length) {
        const encoding = cells[i];

        if (encoding === FULL_ENCODING) {
          fullWidthCache[rowIndex] ??= (
            <CellFullWidth
              api={api}
              row={row}
              rowPin={rowIndex < topCount ? "top" : rowIndex >= firstBotIndex ? "bottom" : null}
              key={`${rowIndex}-full`}
              rowIndex={rowIndex}
              yPositions={yPositions}
            />
          );

          place.push(fullWidthCache[rowIndex]);
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
              api={api}
              column={columns[colIndex]}
              key={`r${rowIndex}-c${colIndex}`}
              rowIndex={rowIndex}
              rowSpan={rowSpan}
              colSpan={colSpan}
              rowPin={rowIndex < topCount ? "top" : rowIndex >= firstBotIndex ? "bottom" : null}
              rowNode={row}
              columnIndex={colIndex}
              yPositions={yPositions}
              xPositions={xPositions}
            />
          );
          place.push(cellCache[rowIndex][colIndex]);
        }
      }
    }

    return [top, center, bottom];
  }, [
    api,
    cellCache,
    columns,
    firstBotIndex,
    fullWidthCache,
    layout,
    rowCount,
    topCount,
    xPositions,
    yPositions,
  ]);

  const viewportWidth = state.internal.viewportInnerWidth.use();
  const endCount = state.columnVisibleEndCount.use();

  const minWidth = Math.max(endCount > 0 ? viewportWidth : 0, width);

  return (
    <>
      {topHeight > 0 && (
        <div
          style={{
            width,
            minWidth,
            top: headerHeight,
            height: topHeight,
            minHeight: topHeight,
            maxHeight: topHeight,
          }}
          className={css`
            position: sticky;
            background-color: ${t.colors.backgrounds_row};
            z-index: 4;
            &::after {
              position: absolute;
              bottom: -1px;
              width: 100%;
              height: 1px;
              content: "";
              background-color: ${t.colors.borders_pin_separator};
            }
          `}
        >
          {top}
        </div>
      )}
      <div
        style={{
          width,
          minWidth,
        }}
        className={css`
          flex: 1;
          background-color: ${t.colors.backgrounds_row};
        `}
      >
        {center}
      </div>
      <div
        style={{
          bottom: 0,
          width,
          minWidth,
          height: botHeight,
          minHeight: botHeight,
          maxHeight: botHeight,
        }}
        className={css`
          position: sticky;
          background-color: ${t.colors.backgrounds_row};
          z-index: 4;

          &::before {
            position: absolute;
            top: -1px;
            width: 100%;
            height: 1px;
            content: "";
            background-color: ${t.colors.borders_pin_separator};
          }
        `}
      >
        {bottom}
      </div>
    </>
  );
}
