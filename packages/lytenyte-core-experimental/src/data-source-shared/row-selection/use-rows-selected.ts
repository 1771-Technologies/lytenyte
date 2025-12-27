import type { RowLeaf, RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../hooks/use-event.js";
import { isRowSelected } from "./is-row-selected.js";
import type { SourceRowSelection } from "./use-row-selection.js";

export function useRowsSelected(
  s: SourceRowSelection,
  rowIdToRow: Map<string, { row: RowNode<any> }>,
  rowParents: (id: string) => string[],
) {
  const rowsSelected: RowSource<any>["rowsSelected"] = useEvent(() => {
    const rows: RowNode<any>[] = [];

    for (const node of rowIdToRow.values()) {
      const selected = isRowSelected(node.row.id, s.rowSelections, rowParents);
      if (selected) rows.push(node.row);
    }

    return { rows, state: s.rowSelectionsRaw };
  });

  return rowsSelected;
}

export function useRowSelectSplitLookup(
  s: SourceRowSelection,
  leafs: Map<string, RowLeaf<any>>,
  group: Map<string, { row: RowNode<any> }> | undefined,
  rowParents: (id: string) => string[],
) {
  const rowsSelected: RowSource<any>["rowsSelected"] = useEvent(() => {
    const rows: RowNode<any>[] = [];

    for (const row of leafs.values()) {
      if (isRowSelected(row.id, s.rowSelections, rowParents)) rows.push(row);
    }

    if (group) {
      for (const node of group.values()) {
        const row = node.row;
        const selected = isRowSelected(row.id, s.rowSelections, rowParents);
        if (selected) rows.push(row);
      }
    }

    return { rows, state: s.rowSelectionsRaw };
  });

  return rowsSelected;
}
