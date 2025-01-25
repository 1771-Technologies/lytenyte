import type { API, BaseColumn, CellEditProvider, Column } from "@1771technologies/grid-types-react";
import { TextEditor } from "./built-in-editors/text";
import { NumberEditor } from "./built-in-editors/number";
import { DateEditor } from "./built-in-editors/date";

export function getBuiltInEditorForType<D>(c: Column<D>) {
  if (c.type === "number") return "number";
  if (c.type === "date") return "date";
  return "text";
}

export function getCellEditor<D>(
  api: API<D>,
  c: Column<D>,
  base: BaseColumn<D>,
): CellEditProvider<D> {
  const editor = c.cellEditProvider ?? base.cellEditProvider ?? getBuiltInEditorForType(c);

  if (typeof editor === "string") {
    if (editor === "text") return TextEditor;
    if (editor === "date") return DateEditor;
    if (editor === "number") return NumberEditor;

    const cell = api.cellEditRegisteredProviders()[editor];
    if (!cell) throw new Error(`No cell editor with id: ${editor} found.`);
    return cell;
  }

  return editor;
}
