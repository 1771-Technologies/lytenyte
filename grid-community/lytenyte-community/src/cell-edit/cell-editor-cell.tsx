import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import type { CellEditLocation, RowNode } from "@1771technologies/grid-types/community";
import { getFocusableElements, sizeFromCoord } from "@1771technologies/js-utils";
import { useGrid } from "../use-grid";
import { getCellEditor } from "./cell-get-editor";
import { useCallback, useMemo, type CSSProperties } from "react";
import { cellEditLocation } from "./cell-edit-location";
import { getTransform } from "../renderer/get-transform";
import { getRootCell } from "@1771technologies/grid-core";

export interface CellEditorCellProps<D> {
  row: RowNode<D>;
  column: ColumnCommunityReact<D>;
  isActive: boolean;
  location: CellEditLocation;
  xPositions: Uint32Array;
  yPositions: Uint32Array;
}

export function CellEditorCell<D>({
  column,
  row,
  xPositions,
  yPositions,
  location,
  isActive,
}: CellEditorCellProps<D>) {
  const { columnIndex } = location;
  const { state, api } = useGrid();
  const vpWidth = state.internal.viewportInnerWidth.use();
  const rtl = state.rtl.use();

  const style = useMemo(() => {
    const isStart = column.pin === "start";
    const isEnd = column.pin === "end";

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth
      : xPositions[columnIndex];

    const root = getRootCell(api, location.rowIndex, location.columnIndex);

    const rowIndex = root?.rowIndex ?? location.rowIndex;
    const colIndex = root?.columnIndex ?? location.columnIndex;
    const rowSpan = root?.rowSpan ?? 1;
    const colSpan = root?.columnSpan ?? 1;

    const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
    const width = sizeFromCoord(colIndex, xPositions, colSpan);

    const rowCount = state.internal.rowCount.peek();
    const rowTopCount = state.internal.rowTopCount.peek();
    const rowBotCount = state.internal.rowBottomCount.peek();

    const firstBotIndex = rowCount - rowBotCount;
    const isTop = rowIndex < rowTopCount;
    const isBot = rowIndex >= rowCount - rowBotCount;

    let paginateOffset = 0;
    if (state.paginate.peek()) {
      const [rowStart] = api.paginateRowStartAndEndForPage(state.paginateCurrentPage.peek());
      paginateOffset = yPositions[rowStart];
    }

    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount] - paginateOffset;

    const transform = getTransform(x * (rtl ? -1 : 1), y);
    const style = { width, height, transform, zIndex: 3 } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 5;
    }

    return style;
  }, [
    api,
    column.pin,
    columnIndex,
    location.columnIndex,
    location.rowIndex,
    rtl,
    state.internal.rowBottomCount,
    state.internal.rowCount,
    state.internal.rowTopCount,
    state.paginate,
    state.paginateCurrentPage,
    vpWidth,
    xPositions,
    yPositions,
  ]);

  const Renderer = getCellEditor(api, column, state.columnBase.use());
  const values = state.internal.cellEditActiveEditValues.use();
  const value = values.get(cellEditLocation(location));

  const isValid = api.cellEditIsValueValid(location);

  const autoFocus = useCallback(
    (el: HTMLDivElement | null) => {
      if (!isActive || !el) return;

      const focusable = getFocusableElements(el)[0];
      if (!focusable) return;

      setTimeout(() => {
        if (el.contains(document.activeElement)) return;
        focusable.focus();
      }, 20);
    },
    [isActive],
  );

  const setValue = useCallback(
    (v: unknown) => {
      api.cellEditSetValue(location, v);
    },
    [api, location],
  );

  return (
    <div
      ref={autoFocus}
      style={style}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
      `}
      onFocus={() => {
        state.internal.cellEditActiveLocation.set(location);
      }}
      onBlur={() => {
        api.cellEditEnd(location);
        state.internal.cellEditActiveLocation.set(null);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          api.cellEditEnd(location);
          ev.preventDefault();
          ev.stopPropagation();

          state.internal.cellFocusQueue.set({
            kind: "cell",
            columnIndex: location.columnIndex,
            rowIndex: location.rowIndex,
          });
        }
        if (ev.key === "Escape") {
          api.cellEditEndAll(true);
          ev.preventDefault();
          ev.stopPropagation();

          state.internal.cellFocusQueue.set({
            kind: "cell",
            columnIndex: location.columnIndex,
            rowIndex: location.rowIndex,
          });
        }
      }}
    >
      <Renderer
        api={api}
        column={column}
        row={row}
        value={value}
        setValue={setValue}
        isValid={isValid}
      />
    </div>
  );
}
