import type { RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import type { SourceRowSelection } from "./use-row-selection";
import { isRowSelected } from "./is-row-selected.js";
import { useEvent } from "../../hooks/use-event.js";

export function useRowIsSelected<T>(
  state: SourceRowSelection,
  rowParents: (id: string) => string[],
  rowIdToRow: (id: string) => RowNode<T> | null | undefined,
) {
  const rowIsSelected: RowSource<T>["rowIsSelected"] = useEvent((id) => {
    const row = rowIdToRow(id);
    if (!row) return false;

    return isRowSelected(row.id, state.rowSelections, rowParents);
  });

  return rowIsSelected;
}
