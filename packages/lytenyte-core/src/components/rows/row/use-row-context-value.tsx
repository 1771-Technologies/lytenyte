import { useMemo } from "react";
import type { RowMeta } from "./context.js";
import type { LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { type RootContextValue } from "../../../root/root-context.js";
import { useEditContext } from "../../../root/contexts/edit-context.js";
import { useRowDetailContext, useRowDetailHeightFn } from "../../../root/contexts/row-detail.js";

export function useRowContextValue(row: LayoutRowWithCells, ctx: RootContextValue) {
  const { source } = ctx;
  const r = source.rowByIndex(row.rowIndex).useValue() as RowMeta["row"];
  const detailHeightFn = useRowDetailHeightFn();
  const { detailExpansions } = useRowDetailContext();

  const edit = useEditContext();

  const isEditing = edit.activeEdit?.rowId === row.id;
  const editColumn = isEditing ? edit.activeEdit.column! : null;

  const editValue = isEditing ? edit.editData : null;
  const editValidation = isEditing ? edit.editValidation : null;

  const detailExpanded = row && detailExpansions.has(row.id);
  const detailHeight = row ? detailHeightFn(row.id) : 0;

  const value = useMemo<RowMeta>(() => {
    return {
      row: r,
      layout: row,

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
      setActiveEdit: edit.setActiveEdit,
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
  ]);

  return value;
}
