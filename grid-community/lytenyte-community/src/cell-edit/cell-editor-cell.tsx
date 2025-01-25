import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import type { CellEditLocation, RowNode } from "@1771technologies/grid-types/community";
import { getFocusableElements } from "@1771technologies/js-utils";
import { useGrid } from "../use-grid";
import { getCellEditor } from "./cell-get-editor";
import { useCallback } from "react";
import { cellEditLocation } from "./cell-edit-location";
import { useCellEditStyle } from "./use-cell-edit-style";

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
  const { state, api } = useGrid();

  const style = useCellEditStyle(column, xPositions, yPositions, location);

  const Renderer = getCellEditor(api, column, state.columnBase.use());
  const values = state.internal.cellEditActiveEditValues.use();
  const value = values.get(cellEditLocation(location));

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
        if (state.internal.cellEditActiveEdits.peek().has(cellEditLocation(location)))
          api.cellEditEnd(location);

        state.internal.cellEditActiveLocation.set(null);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          // Should go down one row.
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
        isValid={api.cellEditIsValueValid(location)}
      />
    </div>
  );
}
