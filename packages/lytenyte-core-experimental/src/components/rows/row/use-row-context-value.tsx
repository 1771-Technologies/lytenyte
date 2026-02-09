import { useMemo } from "react";
import type { RowMeta } from "./context.js";
import type { LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { useEdit, type RootContextValue } from "../../../root/root-context.js";

export function useRowContextValue(row: LayoutRowWithCells, ctx: RootContextValue) {
  const {
    source,
    yPositions,
    xPositions,
    detailExpansions,
    rowDetailHeight,
    rowDetailHeightCache,
    rowDetailAutoHeightGuess,
  } = ctx;
  const r = source.rowByIndex(row.rowIndex).useValue() as RowMeta["row"];

  const edit = useEdit();

  const isEditing = edit.activeEdit?.rowId === row.id;
  const editColumn = isEditing ? edit.activeEdit.column! : null;

  const editValue = isEditing ? edit.editData : null;
  const editValidation = isEditing ? edit.editValidation : null;

  const detailExpanded = row && detailExpansions.has(row.id);
  const detailHeight = !detailExpanded
    ? 0
    : rowDetailHeight === "auto"
      ? (rowDetailHeightCache[row.id] ?? rowDetailAutoHeightGuess)
      : rowDetailHeight;

  const value = useMemo<RowMeta>(() => {
    return {
      row: r,
      layout: row,
      xPositions,
      yPositions,

      detailExpanded,
      detailHeight,

      isEditing,
      editValidation,
      editColumn,
      editData: editValue,
      cancel: edit.cancel,
      commit: edit.commit,
      changeData: edit.changeData,
      changeValue: edit.changeValue,
    };
    // This is exhaustive but with extras for the row.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edit.cancel,
    edit.changeData,
    edit.changeValue,
    edit.commit,
    editColumn,
    editValue,
    editValidation,
    isEditing,
    detailExpanded,
    detailExpansions,
    r?.error,
    r?.loading,
    r,
    r?.__selected,
    r?.__indeterminate,
    r?.__globalSnapshot,
    r?.__localSnapshot,
    row,
    xPositions,
    yPositions,
  ]);

  return value;
}
