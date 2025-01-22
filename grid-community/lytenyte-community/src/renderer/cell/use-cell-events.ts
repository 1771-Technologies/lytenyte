import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { useEvent } from "@1771technologies/react-utils";
import type { MouseEvent } from "react";

export function useCellEvents(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
  row: RowNode,
) {
  void column;
  void row;

  const onClick = useEvent((event: MouseEvent) => {
    handleRowSelection(api, row, event);
  });

  return { onClick };
}

function handleRowSelection(api: ApiCommunityReact<any>, row: RowNode, event: MouseEvent) {
  const sx = api.getState();

  const mode = sx.rowSelectionMode.peek();
  const activator = sx.rowSelectionPointerActivator.peek();
  if (mode === "none" || activator !== "single-click") return;

  const predicate = sx.rowSelectionPredicate.peek();
  const canSelect =
    predicate === "all"
      ? true
      : predicate === "group-only"
        ? api.rowIsGroup(row)
        : predicate === "leaf-only"
          ? api.rowIsLeaf(row)
          : predicate({ row, api });

  if (!canSelect) return;

  const isSelected = sx.rowSelectionSelectedIds.peek().has(row.id);

  const clickToSelect = sx.rowSelectionMultiSelectOnClick.peek();

  if (mode === "single" || (!clickToSelect && !event.ctrlKey && !event.metaKey)) {
    api.rowSelectionClear();
    if (!isSelected) api.rowSelectionSelect([row.id]);
    return;
  }

  if (isSelected) api.rowSelectionDeselect([row.id], sx.rowSelectionSelectChildren.peek());
  else api.rowSelectionSelect([row.id], sx.rowSelectionSelectChildren.peek());
}
