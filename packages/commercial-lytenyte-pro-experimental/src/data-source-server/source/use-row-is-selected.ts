import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { RowSourceServer } from "../use-server-data-source.js";
import type { ServerData } from "../server-data.js";
import type { SourceState } from "./use-source-state.js";
import { isSelected } from "../utils/is-selected.js";

export function useRowIsSelected<T>(source: ServerData, state: SourceState) {
  const rowIsSelected: RowSourceServer<T>["rowIsSelected"] = useEvent((id) => {
    const row = source.tree.rowIdToNode.get(id);
    if (!row) return false;

    return isSelected(row.row.id, state.selections);
  });

  return rowIsSelected;
}
