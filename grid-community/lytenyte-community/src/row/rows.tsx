import "./rows.css";

import { useMemo, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { END_ENCODING, FULL_ENCODING } from "@1771technologies/grid-constants";
import { RowDetail } from "../row-detail/row-detail";
import { RowDragIndicator } from "./row-drag-indicator";
import { CellFullWidth } from "../cell-full-width/cell-full-width";
import { Cell } from "../cell/cell";

export function Rows({
  width,
  ...els
}: {
  width: number;

  top: () => ReactNode;
  bottom: () => ReactNode;
  center: () => ReactNode;
}) {
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

  const detailHeight = state.internal.rowDetailHeight.use();

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

  const paginate = state.paginate.use();
  const currentPage = state.paginateCurrentPage.use();

  const [top, center, bottom] = useMemo(() => {
    const top: ReactNode[] = [];
    const center: ReactNode[] = [];
    const bottom: ReactNode[] = [];

    let paginateOffset = 0;
    if (paginate) {
      const [rowStart] = api.paginateRowStartAndEndForPage(currentPage);
      paginateOffset = yPositions[rowStart];
    }

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
              colCount={columns.length}
              rowPin={rowIndex < topCount ? "top" : rowIndex >= firstBotIndex ? "bottom" : null}
              key={`${rowIndex}-full`}
              rowIndex={rowIndex}
              yPositions={yPositions}
              paginateOffset={paginateOffset}
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
              paginateOffset={paginateOffset}
            />
          );
          place.push(cellCache[rowIndex][colIndex]);
        }
      }
      // Finished processing cells
      const rowDetailHeight = detailHeight(rowIndex);
      if (rowDetailHeight > 0) {
        place.push(
          <RowDetail
            api={api}
            height={rowDetailHeight}
            row={row}
            rowPin={rowIndex < topCount ? "top" : rowIndex >= firstBotIndex ? "bottom" : null}
            rowIndex={rowIndex}
            yPositions={yPositions}
          />,
        );
      }
    }

    return [top, center, bottom];
  }, [
    api,
    cellCache,
    columns,
    currentPage,
    detailHeight,
    firstBotIndex,
    fullWidthCache,
    layout,
    paginate,
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
          className="lng1771-rows__top-section"
        >
          {top}
          <RowDragIndicator section="top" />
          <els.top />
        </div>
      )}
      <div
        style={{
          width,
          minWidth,
        }}
        className="lng1771-rows__center-section"
      >
        {center}
        <RowDragIndicator section="center" />
        <els.center />
      </div>
      {botHeight > 0 && (
        <div
          style={{
            bottom: 0,
            width,
            minWidth,
            height: botHeight,
            minHeight: botHeight,
            maxHeight: botHeight,
          }}
          className="lng1771-rows__bottom-section"
        >
          {bottom}
          <RowDragIndicator section="bottom" />
          <els.bottom />
        </div>
      )}
    </>
  );
}
