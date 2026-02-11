import { useMemo, useRef, useState } from "react";
import type { ColumnAbstract, RowNode } from "@1771technologies/lytenyte-shared";
import { type ColumnView, type RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../hooks/use-event.js";
import type { Root } from "../root.js";
import type { EditContext } from "../root-context.js";
import type { Column } from "../../types/index.js";

export function useEditContext(view: ColumnView, api: Root.API, props: Root.Props, source: RowSource) {
  const [activeEdit, setActiveEdit] = useState<null | {
    readonly rowId: string;
    readonly column: string;
  }>(null);

  const [editValidation, setEditValidation] = useState<boolean | Record<string, unknown>>(true);

  const [editData, setEditData] = useState<any>(null);

  const changeWithInit = useEvent((value: any, row: RowNode<any>, column: ColumnAbstract) => {
    let nextData: any;
    const setter = ((column as any) ?? props.columnBase)?.editSetter as Root.Column["editSetter"];

    const current = editData ?? structuredClone(row.data);

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

  const editDataStateRef = useRef(editData);
  editDataStateRef.current = editData;

  const changeValue = useEvent((value: any, column: Column) => {
    if (!activeEdit) return false;

    const row = api.rowById(activeEdit.rowId);
    if (!column || !row) return false;

    const nextData = changeWithInit(value, row, column);
    if (nextData === false) return false;

    setEditData(nextData);
    editDataStateRef.current = nextData;
    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      const result = validator({ api, editData: nextData, row });
      setEditValidation(result);
      return result;
    }

    setEditValidation(true);
    return true;
  });

  const changeData = useEvent((nextData) => {
    if (!activeEdit) return false;
    const row = api.rowById(activeEdit.rowId);
    if (!row) return false;

    setEditData(nextData);
    editDataStateRef.current = nextData;

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      const result = validator({ api, editData: nextData, row });
      setEditValidation(result);
      return result;
    }

    setEditValidation(true);
    return true;
  });

  const cancel = useEvent(() => {
    if (!activeEdit) return false;

    const column = view.lookup.get(activeEdit.column);
    const row = api.rowById(activeEdit.rowId);
    if (!column || !row) {
      setActiveEdit(null);
      setEditData(null);
      setEditValidation(true);
      return false;
    }

    props.onEditCancel?.({ api, row, column, editData });
    setEditValidation(true);
    setActiveEdit(null);
    setEditData(null);
  });

  const commit = useEvent(() => {
    const editDataState = editDataStateRef.current;

    if (!activeEdit) return false;

    const column = view.lookup.get(activeEdit.column);
    const row = api.rowById(activeEdit.rowId);
    if (!row || !column) return false;

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];

    if (validator) {
      const valid = validator({ api, editData: editDataState, row });
      if (valid === false || typeof valid !== "boolean") {
        props.onEditFail?.({ api, column, row, editData: editDataState, validation: valid });
        return valid;
      }
    }

    for (const c of props.columns ?? []) {
      const mutateEdit = c?.editMutateCommit ?? props.columnBase?.editMutateCommit;
      if (!mutateEdit) continue;
      mutateEdit({ api, column: c, editData: editDataState, row });
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
    setEditValidation(true);
    setEditData(null);
    return true;
  });

  const value = useMemo<EditContext>(() => {
    return {
      activeEdit,
      setActiveEdit,
      editData,
      setEditData,
      editValidation,
      changeValue,
      changeWithInit,
      changeData,
      cancel,
      commit,
    };
  }, [activeEdit, cancel, changeData, changeValue, changeWithInit, commit, editData, editValidation]);

  return value;
}
