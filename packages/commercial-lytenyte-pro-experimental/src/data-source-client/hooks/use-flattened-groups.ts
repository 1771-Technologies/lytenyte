import type {
  AggregationFn,
  RowGroup,
  RowLeaf,
  RowNode,
  SortFn,
  Writable,
} from "@1771technologies/lytenyte-shared";
import type { RootMap, RootNode } from "./use-group-tree/use-group-tree";
import { useMemo } from "react";

type UseFlattenedGroupsReturn<T> = [rows: RowNode<T>[] | null, depth: number];

export function useFlattenedGroups<T>(
  root: RootNode<T> | null,
  agg: AggregationFn<T> | undefined | null,
  leafs: RowLeaf<T>[],
  workingSet: number[],
  sort: SortFn<T> | null | undefined,
  expandedFn: (id: string, depth: number) => boolean,
  suppressLeafExpansion: boolean,
  ignoreIsLast: boolean = false,
) {
  const flat = useMemo<UseFlattenedGroupsReturn<T>>(() => {
    if (!root) return [null, 0];

    const flatList: RowNode<T>[] = [];
    const ranges: { parent: RowGroup | null; start: number; end: number }[] = [];

    type EnhancedRow =
      | (RowGroup & {
          __children: RootMap<T>;
        })
      | RowLeaf<T>;

    let maxDepth = 0;
    function processRowsBetter(
      node: RootMap<T>,
      parent: RowGroup | null,
      start: number,
      isLast: boolean,
      depth = 0,
    ) {
      maxDepth = Math.max(depth + 1, maxDepth);

      const rows = nodeChildrenToRows(node, agg, leafs, workingSet, sort, isLast && !ignoreIsLast);

      let offset = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as EnhancedRow;
        const rowIndex = i + start + offset;

        if (row.kind === "leaf") {
          flatList.push(row);
          continue;
        }

        flatList.push(row as RowGroup);

        const notExpandable = suppressLeafExpansion && row.last;
        (row as Writable<RowGroup>).expandable = !notExpandable;

        if (!expandedFn(row.id, depth) || notExpandable) {
          (row as Writable<RowGroup>).expanded = false;
          continue;
        }
        (row as Writable<RowGroup>).expanded = true;

        offset += processRowsBetter(row.__children, row, rowIndex + 1, row.last, depth + 1);
      }

      ranges.push({ parent, start, end: offset + start + node.size });
      return offset + node.size;
    }

    processRowsBetter(root!.children, null, 0, root.maxDepth <= 1);

    return [flatList, maxDepth];
  }, [agg, expandedFn, ignoreIsLast, leafs, root, sort, suppressLeafExpansion, workingSet]);

  return flat;
}

const nodeChildrenToRows = <T>(
  root: RootMap<T>,
  agg: AggregationFn<T> | null | undefined,
  leafs: RowLeaf<T>[],
  workingSet: number[],
  sort: SortFn<T> | null | undefined,
  isLast: boolean,
) => {
  const values = root.values();

  const rows: RowNode<T>[] = [];
  for (const v of values) {
    if (v.kind === "leaf") {
      rows.push(v.row);
      continue;
    } else {
      const row = v.row;
      if (row.__invalidate) {
        const data = agg ? agg(v.leafs.map((i) => leafs[workingSet[i]])) : {};
        (row as Writable<RowGroup>).data = data;
        row.__invalidate = false;
      }

      rows.push(row);
    }
  }

  if (!isLast && sort) return rows.sort(sort);
  return rows;
};
