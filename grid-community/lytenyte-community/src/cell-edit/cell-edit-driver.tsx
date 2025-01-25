import { useEffect } from "react";
import { useGrid } from "../use-grid";
import { handleBeginCellEditFromEvent } from "./handle-begin-cell-edit";
import { getGridCellPosition } from "@1771technologies/grid-core";

export function CellEditDriver() {
  const { state, api } = useGrid();

  const viewport = state.internal.viewport.use();
  const cellEditActivator = state.cellEditPointerActivator.use();

  useEffect(() => {
    if (!viewport) return;

    const controller = new AbortController();
    const signal = controller.signal;

    if (cellEditActivator === "single-click") {
      viewport.addEventListener("pointerdown", (ev) => handleBeginCellEditFromEvent(api, ev), {
        signal,
      });
    }

    if (cellEditActivator === "double-click") {
      viewport.addEventListener("dblclick", (ev) => {
        if (state.internal.cellEditActiveEdits.peek().size > 0) return;
        handleBeginCellEditFromEvent(api, ev);
      });
    }

    document.addEventListener(
      "keydown",
      (ev) => {
        if (state.internal.cellEditActiveEdits.peek().size === 0) return;

        if (ev.key === "Escape") api.cellEditEndAll();

        if (ev.key === "Tab") {
          const visible = state.columnsVisible.peek();
          const location = state.internal.cellEditActiveLocation.peek();
          if (!location) return;
          const row = api.rowByIndex(location.rowIndex);
          if (!row) return;

          const indices = visible
            .map((c, i) => (api.cellEditPredicate(row, c) ? i : null))
            .filter((c) => c !== null);

          const check = ev.shiftKey ? Math.min(...indices) : Math.max(...indices);
          if (check === location.columnIndex) {
            ev.preventDefault();
            ev.stopPropagation();
            return;
          }
          if (state.cellEditFullRow.peek()) return;

          const currentIndex = indices.findIndex((c) => c === location.columnIndex);
          const next = ev.shiftKey ? indices[currentIndex - 1] : indices[currentIndex + 1];

          const nextLocation = { rowIndex: location.rowIndex, columnIndex: next };
          api.cellEditBegin(nextLocation, true);
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      { signal, capture: true },
    );

    viewport.addEventListener(
      "focusout",
      (ev) => {
        if (state.internal.cellEditActiveEdits.peek().size > 0) return;

        const l = state.internal.cellEditActiveLocation.peek();

        if (!ev.relatedTarget && l) {
          const position = getGridCellPosition(api, l.rowIndex, l.columnIndex);
          api.navigateSetPosition(position);
          state.internal.cellEditActiveLocation.set(null);
        }
      },
      { signal },
    );

    return () => controller.abort();
  }, [
    api,
    cellEditActivator,
    state.cellEditFullRow,
    state.columnsVisible,
    state.internal.cellEditActiveEdits,
    state.internal.cellEditActiveLocation,
    viewport,
  ]);

  return <></>;
}
