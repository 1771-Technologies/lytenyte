import "./cell-edit.css";

import type { ColumnCommunityReact } from "@1771technologies/grid-types";
import type { CellEditLocation, RowNode } from "@1771technologies/grid-types/community";
import { getFocusableElements } from "@1771technologies/js-utils";
import { useGrid } from "../use-grid";
import { getCellEditor } from "./cell-get-editor";
import { useCallback } from "react";
import { cellEditLocation } from "./cell-edit-location";
import { useCellEditStyle } from "./use-cell-edit-style";
import { useCellEditNavigation } from "./use-cell-edit-navigation";

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

  const onKeyDown = useCellEditNavigation(api, location);

  return (
    <div
      ref={autoFocus}
      style={style}
      className="lng1771-cell__edit"
      onFocus={() => {
        state.internal.cellEditActiveLocation.set(location);
      }}
      onBlur={() => {
        if (state.internal.cellEditActiveEdits.peek().has(cellEditLocation(location)))
          api.cellEditEnd(location);

        state.internal.cellEditActiveLocation.set(null);
      }}
      onKeyDown={onKeyDown}
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
