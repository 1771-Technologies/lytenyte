import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { RowSourceServer } from "../use-server-data-source";
import type { ServerData } from "../server-data";
import type { RowNode } from "@1771technologies/lytenyte-shared";
import { isSelected } from "../utils/is-selected.js";
import type { SourceState } from "./use-source-state";

export function useRowsSelected<T>(source: ServerData, s: SourceState, getParents: (id: string) => string[]) {
  const rowsSelected: RowSourceServer<T>["rowsSelected"] = useEvent(() => {
    const nodes = source.tree.rowIdToNode;

    const rows: RowNode<T>[] = [];

    for (const node of nodes.values()) {
      const selected = isSelected(node.row.id, s.selections, getParents);
      if (selected) rows.push(node.row);
    }

    return { loadedNodesSelected: rows, state: s.rawSelections };
  });

  return rowsSelected;
}
