import { getFocusableElements, sizeFromCoord } from "@1771technologies/js-utils";
import type { CellEditLocation, Column, RowNode } from "@1771technologies/grid-types-react";
import { getCellEditor } from "./get-cell-editor";
import { useCallback, useEffect, useState } from "react";
import { useGridStore } from "@1771technologies/lng-component-react-store-provider";
import { useGetX } from "@1771technologies/lng-component-react-use-get-x";
import { getPositionStyles } from "@1771technologies/lng-component-react-get-position-styles";

export interface CellEditorCellProps<D> {
  isStart: boolean;
  isEnd: boolean;
  row: RowNode<D>;
  column: Column<D>;
  xPositions: Uint32Array;
  height: number;
  endCount: number;
  startCount: number;
  viewportWidth: number;
  isActive: boolean;
  location: CellEditLocation;
}

export function CellEditorCell<D>({
  column,
  row,
  xPositions,
  endCount,
  viewportWidth,
  height,
  isStart,
  isEnd,
  startCount,
  location,
  isActive,
}: CellEditorCellProps<D>) {
  const { columnIndex } = location;
  const store = useGridStore();
  const api = store.state.api;

  const getX = useGetX(startCount, endCount, xPositions, store.state.rtl);
  const width = sizeFromCoord(columnIndex, xPositions);

  const x = getX(columnIndex);
  const positionStyle = getPositionStyles(isStart, isEnd, viewportWidth, width, x);

  const Renderer = getCellEditor(api, column, api.getProperty("columnBase"));
  const value = api.useSelector((s) => s.cellEditValue(location));

  const [cell, setCell] = useState<HTMLDivElement | null>(null);

  const isValid = api.useSelector((s) => s.cellEditIsValueValid(location));

  useEffect(() => {
    if (!cell) return;

    const controller = new AbortController();
    const signal = controller.signal;

    cell.addEventListener(
      "focusout",
      () => {
        if (!api.cellEditIsActive()) return;
        if (!api.getProperty("cellEditFullRow")) api.cellEditEnd(location);
      },
      { signal },
    );
    cell.addEventListener(
      "focusin",
      () => {
        if (!api.cellEditIsActive()) return;
        store.set({ activeCellEditLocation: location });
      },
      { signal },
    );

    return () => controller.abort();
  }, [api, cell, location, store]);

  const autoFocus = useCallback(
    (el: HTMLDivElement | null) => {
      setCell(el);
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
      style={{
        width: width,
        height: height,
        display: "inline-block",
        ...positionStyle,
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
