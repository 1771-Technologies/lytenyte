import { useMemo, useState } from "react";
import { usePiece } from "../../hooks/use-piece.js";
import type { ColumnAbstract, RowNode } from "@1771technologies/lytenyte-shared";
import { type ColumnView, type RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../hooks/use-event.js";
import type { Root } from "../root.js";
import type { EditContext } from "../root-context.js";

export function useEditContext(view: ColumnView, api: Root.API, props: Root.Props, source: RowSource) {
  const [activeEditState, setActiveEdit] = useState<null | {
    readonly rowId: string;
    readonly column: string;
  }>(null);
  const activeEdit = usePiece(activeEditState, setActiveEdit);
  const activeRow = usePiece(activeEditState?.rowId ?? null);

  const [editDataState, setEditDataState] = useState<any>(null);
  const editData = usePiece(editDataState, setEditDataState);

  const changeWithInit = useEvent((value: any, row: RowNode<any>, column: ColumnAbstract) => {
    let nextData: any;
    const setter = (column as any).editSetter as Root.Column["editSetter"];

    const current = editDataState ?? row.data;

    if (setter) {
      nextData = setter({ api, column, editData: current, editValue: value, row });
    } else {
      const field = ((column as any).field ?? column.id) as Root.Column["field"];
      if (typeof field !== "number" && typeof field !== "string") return false;
      nextData = Array.isArray(current) ? [...current] : { ...current };
      nextData[field] = value;
    }

    return nextData;
  });

  const changeValue = useEvent((value: any) => {
    if (!activeEditState) return false;

    const column = view.lookup.get(activeEditState.column);
    const row = api.rowById(activeEditState.rowId);
    if (!column || !row) return false;

    const nextData = changeWithInit(value, row, column);
    if (nextData === false) return false;

    setEditDataState(nextData);
    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      return validator({ api, editData: nextData, row });
    }
    return true;
  });

  const changeData = useEvent((nextData) => {
    if (!activeEditState) return false;
    const row = api.rowById(activeEditState.rowId);
    if (!row) return false;

    setEditDataState(nextData);

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      return validator({ api, editData: nextData, row });
    }
    return true;
  });

  const cancel = useEvent(() => {
    if (!activeEditState) return false;

    const column = view.lookup.get(activeEditState.column);
    const row = api.rowById(activeEditState.rowId);
    if (!column || !row) {
      setActiveEdit(null);
      setEditDataState(null);
      return false;
    }

    props.onEditCancel?.({ api, row, column, editData });
    setActiveEdit(null);
    setEditDataState(null);
  });

  const commit = useEvent(() => {
    if (!activeEditState) return false;

    const column = view.lookup.get(activeEditState.column);
    const row = api.rowById(activeEditState.rowId);
    if (!row || !column) return false;

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      const valid = validator({ api, editData: editDataState, row });
      if (valid === false || typeof valid !== "boolean") {
        props.onEditFail?.({ api, column, row, editData: editDataState, validation: valid });
        return valid;
      }
    }

    let stop = false;

    props.onEditEnd?.({
      api,
      row,
      column,
      editData: editDataState,
      preventDefault: () => {
        stop = true;
      },
    });

    if (stop) return true;

    const updateMap = new Map<RowNode<any>, any>();
    updateMap.set(row, editDataState);
    source.onRowsUpdated(updateMap);

    setActiveEdit(null);
    setEditDataState(null);
    return true;
  });

  const value = useMemo<EditContext>(() => {
    return {
      activeEdit,
      activeRow,
      editData,
      changeValue,
      changeWithInit,
      changeData,
      cancel,
      commit,
    };
  }, [activeEdit, activeRow, cancel, changeData, changeValue, changeWithInit, commit, editData]);

  return value;
}
