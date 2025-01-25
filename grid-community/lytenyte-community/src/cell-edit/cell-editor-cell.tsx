import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import type { CellEditLocation, RowNode } from "@1771technologies/grid-types/community";
import { getFocusableElements, sizeFromCoord } from "@1771technologies/js-utils";
import { useGrid } from "../use-grid";
import { getCellEditor } from "./cell-get-editor";
import { useCallback, useEffect, useState } from "react";
import { cellEditLocation } from "./cell-edit-location";

export interface CellEditorCellProps<D> {
  row: RowNode<D>;
  column: ColumnCommunityReact<D>;
  xPositions: Uint32Array;
  height: number;
  isActive: boolean;
  location: CellEditLocation;
}

export function CellEditorCell<D>({
  column,
  row,
  xPositions,
  height,
  location,
  isActive,
}: CellEditorCellProps<D>) {
  const { columnIndex } = location;
  const { state, api } = useGrid();

  const width = sizeFromCoord(columnIndex, xPositions);

  const Renderer = getCellEditor(api, column, state.columnBase.use());

  const values = state.internal.cellEditActiveEditValues.use();
  const value = values.get(cellEditLocation(location));

  const [cell, setCell] = useState<HTMLDivElement | null>(null);

  const isValid = api.cellEditIsValueValid(location);

  useEffect(() => {
    if (!cell) return;

    const controller = new AbortController();
    const signal = controller.signal;

    cell.addEventListener(
      "focusout",
      () => {
        if (!api.cellEditIsActive()) return;
        const fullRow = state.cellEditFullRow.peek();
        if (!fullRow) api.cellEditEnd(location);
      },
      { signal },
    );
    cell.addEventListener(
      "focusin",
      () => {
        if (!api.cellEditIsActive()) return;

        state.internal.cellEditActiveLocation.set(location);
      },
      { signal },
    );

    return () => controller.abort();
  }, [api, cell, location, state.cellEditFullRow, state.internal.cellEditActiveLocation]);

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
