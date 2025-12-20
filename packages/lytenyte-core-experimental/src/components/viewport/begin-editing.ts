import type { PositionUnion } from "@1771technologies/lytenyte-shared";
import type { API } from "../../types/types-internal";
import type { EditContext } from "../../root/root-context";

export function beginEditing(
  api: API,
  edit: EditContext,
  focusPos: PositionUnion | null,
  editMode: "cell" | "row" | "readonly",
  editActivator: "single" | "double-click" | "none",
  activator?: "single" | "double-click",
  initValue?: any,
) {
  if (focusPos?.kind !== "cell" || editMode === "readonly") return;
  if (activator && editActivator !== activator) return;

  const column = api.columnByIndex(focusPos.colIndex);
  if (!column) return;
  if (api.editIsCellActive({ column, rowIndex: focusPos.rowIndex })) return;

  let init;
  if (initValue) {
    const row = api.rowByIndex(focusPos.rowIndex).get();

    if (row) {
      const nextData = edit.changeWithInit(initValue, row, column);
      if (nextData != false) init = nextData;
    }
  }

  api.editBegin({ column, rowIndex: focusPos.rowIndex, init });
}
