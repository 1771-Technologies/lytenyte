import { useMemo } from "react";
import type { TreeRoot } from "../types";
import type { RowAggregated, RowLeaf, RowNode } from "@1771technologies/lytenyte-shared";

const empty: any[] = [];
export function useFlattened<T>(
  tree: TreeRoot,
  expandFn: (id: string, depth: number) => boolean,
  top: (RowLeaf<T> | RowAggregated)[] = empty,
  bot: (RowLeaf<T> | RowAggregated)[] = empty,
  idUniverseAdditions: Set<string> | null | undefined,
) {
  const flat = useMemo(() => {
    const stack = [...tree.children.values()];
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

      if (node.kind === "parent" && expandFn(node.row.id, node.row.depth)) {
        stack.unshift(...node.children.values());
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
  }, [bot, expandFn, top, tree.children]);

  return useMemo(() => {
    const initialSet = new Set(tree.rowIdToNode.keys());
    top.map((x) => initialSet.add(x.id));
    bot.map((x) => initialSet.add(x.id));

    return { ...flat, idUniverse: idUniverseAdditions ? initialSet.union(idUniverseAdditions) : initialSet };
  }, [bot, flat, idUniverseAdditions, top, tree.rowIdToNode]);
}
