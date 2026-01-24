import { useMemo } from "react";
import type { TreeRoot } from "../types";
import type {
  RowAggregated,
  RowGroup,
  RowLeaf,
  RowNode,
  SortFn,
  Writable,
} from "@1771technologies/lytenyte-shared";

const empty: any[] = [];
export function useFlattened<T>(
  tree: TreeRoot,
  expandFn: (id: string, depth: number) => boolean,
  top: (RowLeaf<T> | RowAggregated)[] = empty,
  bot: (RowLeaf<T> | RowAggregated)[] = empty,
  idUniverseAdditions: { readonly id: string; readonly root: boolean }[] | null | undefined,
  idUniverseSubtractions: Set<string> | null | undefined,
  sort: SortFn<T> | null | undefined,
) {
  const flat = useMemo(() => {
    const stack = [...tree.children.values()];

    if (sort) stack.sort((l, r) => sort(l.row, r.row));

    const indexToRow = new Map<number, RowNode<T>>();
    const idToIndex = new Map<string, number>();

    const rows: RowNode<T>[] = [...top];

    top.map((x, i) => {
      indexToRow.set(i, x);
      idToIndex.set(x.id, i);
    });

    let maxDepth = 0;
    while (stack.length) {
      const node = stack.shift()!;

      indexToRow.set(rows.length, node.row);
      idToIndex.set(node.row.id, rows.length);
      rows.push(node.row);

      if (node.kind === "parent") maxDepth = Math.max(maxDepth, node.row.depth + 1);

      if (node.kind === "parent" && expandFn(node.row.id, node.row.depth) && node.row.expandable) {
        (node.row as Writable<RowGroup>).expanded = true;
        const children = [...node.children.values()];
        if (sort) children.sort((l, r) => sort(l.row, r.row));

        stack.unshift(...children);
      } else if (node.kind === "parent") {
        (node.row as Writable<RowGroup>).expanded = false;
      }
    }

    rows.push(...bot);
    bot.map((x, i) => {
      indexToRow.set(i, x);
      idToIndex.set(x.id, i);
    });

    return {
      rows,
      indexToRow,
      idToIndex,
      rowCount: rows.length,
      topCount: top.length,
      botCount: bot.length,
      maxDepth,
    };
  }, [bot, expandFn, sort, top, tree.children]);

  return useMemo(() => {
    const initialSet = new Set(tree.rowIdToNode.keys());
    top.map((x) => initialSet.add(x.id));
    bot.map((x) => initialSet.add(x.id));

    const subSet = idUniverseSubtractions ?? new Set();
    const rootAdds = idUniverseAdditions?.filter((x) => x.root)?.map((x) => x.id) ?? [];
    const rootIds = new Set([...tree.children.values().map((x) => x.row.id)].concat(rootAdds)).difference(
      subSet,
    );

    return {
      ...flat,
      idUniverse: idUniverseAdditions
        ? initialSet.union(new Set(idUniverseAdditions.map((x) => x.id) ?? [])).difference(subSet)
        : initialSet.difference(subSet),
      rootIds,
      rootCount: rootIds.size,
    };
  }, [bot, flat, idUniverseAdditions, idUniverseSubtractions, top, tree.children, tree.rowIdToNode]);
}
