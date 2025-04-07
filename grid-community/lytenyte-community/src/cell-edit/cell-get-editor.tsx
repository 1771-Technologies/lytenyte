import { TextEditor } from "./built-in-editors/text";
import { NumberEditor } from "./built-in-editors/number";
import { DateEditor } from "./built-in-editors/date";
import type {
  ApiCoreReact,
  CellEditProviderCoreReact,
  ColumnBaseCoreReact,
  ColumnCoreReact,
} from "@1771technologies/grid-types/core-react";

export function getBuiltInEditorForType<D>(c: ColumnCoreReact<D>) {
  if (c.type === "number") return "number";
  if (c.type === "date") return "date";
  return "text";
}

export function getCellEditor<D>(
  api: ApiCoreReact<D>,
  c: ColumnCoreReact<D>,
  base: ColumnBaseCoreReact<D>,
): CellEditProviderCoreReact<D> {
  const editor = c.cellEditProvider ?? base.cellEditProvider ?? getBuiltInEditorForType(c);

  if (typeof editor === "string") {
    if (editor === "text") return TextEditor;
    if (editor === "date") return DateEditor;
    if (editor === "number") return NumberEditor;

    const cell = api.getState().cellEditProviders.peek()[editor];
    if (!cell) throw new Error(`No cell editor with id: ${editor} found.`);
    return cell;
  }

  return editor;
}
