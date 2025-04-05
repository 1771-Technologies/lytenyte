import { getRootCell } from "@1771technologies/grid-core";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { CellEditLocation } from "@1771technologies/grid-types/core";
import { useEvent } from "@1771technologies/react-utils";
import type { KeyboardEvent } from "react";

export function useCellEditNavigation(api: ApiCommunityReact<any>, location: CellEditLocation) {
  const onKeyDown = useEvent((ev: KeyboardEvent) => {
    const sx = api.getState();

    let handled = false;
    if (ev.key === "Escape") {
      api.cellEditEnd(location);
      handled = true;

      sx.internal.cellFocusQueue.set({
        kind: "cell",
        columnIndex: location.columnIndex,
        rowIndex: location.rowIndex,
      });
    }

    const meta = ev.ctrlKey || ev.metaKey;

    if (ev.key === "Enter" && !meta) {
      const visible = sx.columnsVisible.peek();

      const columnIndex = location.columnIndex;
      const rowCount = sx.internal.rowCount.peek();

      let nextLocal: CellEditLocation | null = null;

      let currentRow = location.rowIndex;
      do {
        if (currentRow >= rowCount) break;
        const root = getRootCell(api, currentRow, columnIndex);

        currentRow = root ? root.rowIndex + root.rowSpan : currentRow + 1;

        const row = api.rowByIndex(currentRow);
        const isFull = sx.internal.rowIsFullWidthInternal.peek()(currentRow);
        if (!row) break;

        if (api.cellEditPredicate(row, visible[columnIndex]) && !isFull) {
          nextLocal = { rowIndex: currentRow, columnIndex };
          break;
        }
        // eslint-disable-next-line no-constant-condition
      } while (true);

      if (!nextLocal) {
        api.cellEditEnd(location);
        sx.internal.cellFocusQueue.set({
          kind: "cell",
          columnIndex: location.columnIndex,
          rowIndex: location.rowIndex,
        });
        handled = true;
      } else {
        api.navigateScrollIntoView(nextLocal.rowIndex, nextLocal.columnIndex);
        api.cellEditBegin(nextLocal, true);
        handled = true;
      }
    }

    if (ev.key === "Enter" && meta) {
      api.cellEditEnd(location);
      sx.internal.cellFocusQueue.set({
        kind: "cell",
        columnIndex: location.columnIndex,
        rowIndex: location.rowIndex,
      });
    }

    if (ev.key === "Tab") {
      const visible = sx.columnsVisible.peek();

      const row = api.rowByIndex(location.rowIndex);
      if (!row) return;

      const indices = visible
        .map((c, i) => (api.cellEditPredicate(row, c) ? i : null))
        .filter((c) => c !== null);

      const check = ev.shiftKey ? Math.min(...indices) : Math.max(...indices);
      if (check === location.columnIndex) {
        handled = true;
      } else {
        const currentIndex = indices.findIndex((c) => c === location.columnIndex);
        const next = ev.shiftKey ? indices[currentIndex - 1] : indices[currentIndex + 1];

        const nextLocation = { rowIndex: location.rowIndex, columnIndex: next };
        api.navigateScrollIntoView(nextLocation.rowIndex, nextLocation.columnIndex);
        api.cellEditBegin(nextLocation, true);
      }
    }

    if (handled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  });

  return onKeyDown;
}
