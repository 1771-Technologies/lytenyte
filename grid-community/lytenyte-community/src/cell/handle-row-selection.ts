import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/core";

export function handleRowSelection(
  api: ApiCommunityReact<any>,
  row: RowNode,
  bulk: boolean,
  meta: boolean,
  ignoreActivator: boolean = false,
  expectedActivator: "single-click" | "double-click" = "single-click",
) {
  const sx = api.getState();

  const mode = sx.rowSelectionMode.peek();
  const activator = sx.rowSelectionPointerActivator.peek();
  if (mode === "none" || (activator !== expectedActivator && !ignoreActivator)) return;

  const canSelect = canSelectRow(api, row);

  if (!canSelect) return;

  const isSelected = sx.rowSelectionSelectedIds.peek().has(row.id);
  if (mode === "single") {
    api.rowSelectionClear();
    if (!isSelected) api.rowSelectionSelect([row.id]);
    return;
  }

  const pivotIndex = sx.internal.rowSelectionPivotIndex.peek();
  const lastWasDeselect = sx.internal.rowSelectionLastWasDeselect.peek();

  const childrenAsWell = sx.rowSelectionSelectChildren.peek();

  const rowIndex = row.rowIndex!;
  if (bulk && pivotIndex != null) {
    const idsToChange = [];

    const start = Math.min(rowIndex, pivotIndex);
    const end = Math.max(rowIndex, pivotIndex) + 1;
    for (let i = start; i < end; i++) {
      const row = api.rowByIndex(i);
      if (!row || !canSelectRow(api, row)) continue;

      idsToChange.push(row.id);
    }

    if (lastWasDeselect) api.rowSelectionDeselect(idsToChange, childrenAsWell);
    else api.rowSelectionSelect(idsToChange, childrenAsWell);

    return;
  }

  const additive = meta || sx.rowSelectionMultiSelectOnClick.peek();

  if (additive) {
    if (isSelected) api.rowSelectionDeselect([row.id], sx.rowSelectionSelectChildren.peek());
    else api.rowSelectionSelect([row.id], sx.rowSelectionSelectChildren.peek());

    sx.internal.rowSelectionPivotIndex.set(rowIndex);
    sx.internal.rowSelectionLastWasDeselect.set(isSelected);
    return;
  }

  sx.internal.rowSelectionPivotIndex.set(rowIndex);
  sx.internal.rowSelectionLastWasDeselect.set(isSelected);

  api.rowSelectionClear();
  if (!isSelected) api.rowSelectionSelect([row.id]);
}

export function canSelectRow(api: ApiCommunityReact<any>, row: RowNode) {
  const predicate = api.getState().rowSelectionPredicate.peek();

  const canSelect =
    predicate === "all"
      ? true
      : predicate === "group-only"
        ? api.rowIsGroup(row)
        : predicate === "leaf-only"
          ? api.rowIsLeaf(row)
          : predicate({ row, api });

  return canSelect;
}
