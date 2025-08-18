import {
  focusCell,
  getHeaderRows,
  handleNavigationKeys,
  isColumnFloatingHeader,
} from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi, PositionHeaderGroupCell } from "../../+types";
import type { InternalAtoms } from "../+types.js";
import { clamp } from "@1771technologies/lytenyte-js-utils";

export const makeFocusCell = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["focusCell"] => {
  return (position) => {
    const vp = grid.state.viewport.get();
    if (!vp) return false;

    if (typeof position === "string") {
      let key = "";
      if (position === "up") key = "ArrowUp";
      else if (position === "down") key = "ArrowDown";
      else if (position === "next") key = grid.state.rtl.get() ? "ArrowLeft" : "ArrowRight";
      else if (position === "prev") key = grid.state.rtl.get() ? "ArrowRight" : "ArrowLeft";

      if (!key) return false;

      const ds = grid.state.rowDataStore;
      handleNavigationKeys(
        {
          key,
          ctrlKey: false,
          metaKey: false,
          preventDefault: () => {},
          stopPropagation: () => {},
        },
        {
          vp,
          rowCount: ds.rowCount.get(),
          topCount: ds.rowTopCount.get(),
          centerCount: ds.rowCenterCount.get(),
          columnCount: grid.state.columnMeta.get().columnsVisible.length,
          focusActive: grid.internal.focusActive,
          id: grid.state.gridId.get(),
          layout: grid.internal.layout.get(),
          rtl: grid.state.rtl.get(),
          scrollIntoView: grid.api.scrollIntoView,
        },
      );
      return true;
    }

    if ("kind" in position) {
      if (position.kind === "header-cell") {
        grid.api.scrollIntoView({ column: position.colIndex });

        const run = () => {
          const header = getHeaderRows(vp);
          if (!header) return false;

          for (const row of header) {
            const cell = row.querySelector(
              `[data-ln-header-cell][data-ln-colindex="${position.colIndex}"]`,
            ) as HTMLElement;

            if (!cell) continue;
            if (isColumnFloatingHeader(cell)) continue;

            cell.focus();
            return true;
          }
          return false;
        };

        if (!run()) {
          setTimeout(() => {
            if (!run()) {
              setTimeout(() => run(), 20);
            }
          }, 8);
        }
        return true;
      } else if (position.kind === "header-group-cell") {
        grid.api.scrollIntoView({ column: position.colIndex });

        const run = () => {
          const header = getHeaderRows(vp);
          if (!header) return false;

          const row = header[position.hierarchyRowIndex];
          if (!row) return false;

          const headers = Array.from(
            row.querySelectorAll("[data-ln-header-range]"),
          ) as HTMLElement[];

          const match = headers.find((c) => {
            const [colStartStr, colEndStr] = c.getAttribute("data-ln-header-range")!.split(",");
            const colStart = Number.parseInt(colStartStr);
            const colEnd = Number.parseInt(colEndStr);

            return colStart <= position.colIndex && position.colIndex < colEnd;
          });

          if (match) {
            match.focus();
            grid.internal.focusActive.set(
              (prev) => ({ ...prev, colIndex }) as PositionHeaderGroupCell,
            );
            return true;
          }

          return false;
        };

        if (!run()) {
          setTimeout(() => {
            if (!run()) {
              setTimeout(() => run(), 20);
            }
          }, 8);
        }

        return true;
      } else {
        return false;
      }
    }

    const columnCount = grid.state.columnMeta.get().columnsVisible.length - 1;
    const colIndex = clamp(
      0,
      typeof position.column === "number" ? position.column : grid.api.columnIndex(position.column),
      columnCount,
    );

    focusCell({
      colIndex,
      rowIndex: position.row,
      focusActive: grid.internal.focusActive,
      id: grid.state.gridId.get(),
      layout: grid.internal.layout.get(),
      scrollIntoView: grid.api.scrollIntoView,
      vp,
    });

    return false;
  };
};
