import { ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { RowTree } from "./make-row-tree";
import type { RowGroupExpansionsCore, RowNodeCore } from "@1771technologies/grid-types/core";

export function getFlattenedTree<D>(
  rowTree: RowTree<D>,
  expansions: RowGroupExpansionsCore,
  defaultExpansion: boolean | number,
  hasGroups: boolean,
  sorter: null | ((left: RowNodeCore<D>, right: RowNodeCore<D>) => number),
  topOffset: number,
) {
  const root = rowTree.rootIds;

  // We have a flat tree, so the root is all the ids we need
  if (!hasGroups) {
    const rows = root.map((r) => rowTree.rowIdToRowNode[r]);

    if (sorter) {
      rows.sort(sorter);
    }

    const rowIndexToRow = new Map();
    const rowIdToRowIndex = new Map();
    rows.forEach((r, i) => {
      const index = i + topOffset;
      (r as any).rowIndex = index;
      rowIndexToRow.set(index, r);
      rowIdToRowIndex.set(r.id, index);
    });

    return { rows, rowIndexToRow, rowIdToRowIndex };
  }

  const maybeSort = (rows: RowNodeCore<D>[]) => (sorter ? rows.sort(sorter) : rows);

  const rootRows = maybeSort(root.map((r) => rowTree.rowIdToRowNode[r]));

  const rowIdToParentId = new Map<string, string | null>();
  const rowIdToDepth = new Map<string, number>();
  const rowIdToRowIndex = new Map<string, number>();
  const rowIndexToRow = new Map<number, RowNodeCore<D>>();

  const stack = rootRows.map((r) => [r, null, 0] as [RowNodeCore<D>, string | null, number]);

  const flattened: RowNodeCore<D>[] = [];

  let count = topOffset;
  while (stack.length) {
    const [row, parent, depth] = stack.shift()!;

    rowIdToParentId.set(row.id, parent);
    rowIdToDepth.set(row.id, depth);
    rowIndexToRow.set(count, row);
    rowIdToRowIndex.set(row.id, count);

    // Aggregate here if necessary.
    (row as any).rowIndex = count;
    count++;
    flattened.push(row);

    const isExpanded =
      expansions[row.id] ??
      (defaultExpansion || (typeof defaultExpansion === "number" && depth <= defaultExpansion));

    // We have group row so potentially add more
    if (row.kind === ROW_GROUP_KIND) {
      if (isExpanded) {
        const childIds = [...rowTree.rowGroupIdToChildRowIds[row.id]];
        const childRows = maybeSort(childIds.map((r) => rowTree.rowIdToRowNode[r]));
        const mapped = childRows.map(
          (r) => [r, row.id, depth + 1] as [RowNodeCore<D>, string | null, number],
        );

        stack.unshift(...mapped);
      }
    }
  }

  return {
    rows: flattened,
    rowIndexToRow: rowIndexToRow,
    rowIdToRowIndex: rowIdToRowIndex,
    rowIdToDepth,
    rowIdToParentId,
  };
}
