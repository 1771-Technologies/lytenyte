import { type ColumnView } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root";
import type { Column } from "../../../../types/column.js";
import { computeField } from "../auxiliary-functions/compute-field.js";

export function useColumnField(view: ColumnView): Root.API["columnField"] {
  return useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = (column as Column).field ?? column.id;
    return computeField(field, row);
  });
}
