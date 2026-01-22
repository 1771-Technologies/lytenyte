import {
  getFirstTabbable,
  queryCell,
  runWithBackoff,
  type ColumnView,
} from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { EditContext } from "../../../root-context.js";

export function useEditBegin(
  props: Root.Props,
  api: Root.API,
  view: ColumnView,
  edit: EditContext,
  vp: HTMLElement | null,
  gridId: string,
): Root.API["editBegin"] {
  return useEvent(({ init, column: c, rowIndex, focusIfNotEditable }) => {
    const row = api.rowByIndex(rowIndex).get();
    const column =
      typeof c === "number"
        ? api.columnByIndex(c)
        : typeof c === "string"
          ? api.columnById(c)
          : api.columnById(c.id);

    const columnIndex = view.visibleColumns.findIndex((x) => x.id === column?.id);

    if (!vp || !row || !column || columnIndex == -1 || props.rowFullWidthPredicate?.({ rowIndex, row, api }))
      return;

    // If there is already an active edit commit it.
    edit.commit();

    const base = props.columnBase as Root.Column;
    const editable = column.editable ?? base.editable;
    if (typeof editable === "function" ? !editable({ api, row, column }) : !editable) {
      if (focusIfNotEditable) {
        api.scrollIntoView({ column, row: rowIndex, behavior: "instant" });
        runWithBackoff(() => {
          const cell = queryCell(gridId, rowIndex, columnIndex, vp);
          if (!cell) return false;

          cell.focus();
          return true;
        }, [8, 16, 32, 64, 128]);
      }

      return;
    }

    let stop = false;
    const preventDefault = () => {
      stop = true;
    };

    const editData = init ?? structuredClone(row.data);
    props.onEditBegin?.({ api, column, editData, preventDefault, row });

    if (stop) return;

    edit.activeEdit.set({ rowId: row.id, column: column.id });
    edit.editData.set(editData);

    api.scrollIntoView({ column, row: rowIndex, behavior: "instant" });
    runWithBackoff(() => {
      const cell = queryCell(gridId, rowIndex, columnIndex, vp);
      if (!cell || cell.getAttribute("data-ln-edit-active") !== "true") return false;

      const first = getFirstTabbable(cell, false);
      if (!first) return false;

      first.focus();

      return true;
    }, [8, 16, 32, 64, 128]);
  });
}
