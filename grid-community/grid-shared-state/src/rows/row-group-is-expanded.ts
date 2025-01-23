import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";

export const rowGroupIsExpanded = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  row: RowNode<D>,
) => {
  if (!api.rowIsGroup(row)) return false;

  const sx = api.getState();
  const defaultExpansions = sx.rowGroupDefaultExpansion.peek();

  const expansions = sx.rowGroupExpansions.peek();
  const expanded = Object.fromEntries(Object.values(expansions).flatMap((c) => Object.entries(c)));

  if (expanded[row.id] != null) return expanded[row.id];

  const rowIndex = sx.internal.rowBackingDataSource.peek().rowIdToRowIndex(row.id);
  if (rowIndex == null) return false;

  const depth = api.rowDepth(rowIndex);

  if (typeof defaultExpansions === "number") return depth <= defaultExpansions;
  return defaultExpansions;
};
