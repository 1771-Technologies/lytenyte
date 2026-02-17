import type { PositionUnion } from "@1771technologies/lytenyte-shared";
import type { EditContext } from "../../root/root-context";
import type { Root } from "../../root/root";

export function beginEditing(
  api: Root.API,
  edit: EditContext,
  focusPos: PositionUnion | null,
  editMode: "cell" | "row" | "readonly",
  editActivator: "single-click" | "double-click" | "none",
  activator?: "single-click" | "double-click",
  initValue?: any,
  printable?: boolean,
) {
  if (focusPos?.kind !== "cell" || editMode === "readonly") return;
  if (activator && editActivator !== activator) return;

  const column = api.columnByIndex(focusPos.colIndex);
  const base = api.props().columnBase;

  const editOnPrintable = column?.editOnPrintable ?? base?.editOnPrintable ?? true;

  if (!column || (printable && !editOnPrintable)) return;
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
