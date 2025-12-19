import type { LeafIdFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo, useRef } from "react";
import { makeLeafNode } from "../make-leaf-node.js";

const leafIdFallback: LeafIdFn<any> = (_, i, s) => (s !== "center" ? `leaf-${i}-${s}` : `leaf-${i}`);
export function useLeafNodes<T>(
  top: T[] | undefined,
  center: T[],
  bot: T[] | undefined,
  leafIdFn: LeafIdFn<T> | undefined,
) {
  const nodeCache = useRef(new Map<T, RowLeaf<T>>());

  const leafsCenter = useMemo(() => {
    const nextMap = new Map<T, RowLeaf<T>>();
    const nextNodes: RowLeaf<T>[] = [];

    const lookup = nodeCache.current;

    for (let i = 0; i < center.length; i++) {
      const d = center[i];
      const node = lookup.get(d) ?? makeLeafNode(d, i, "center", leafIdFn ?? leafIdFallback);

      nextMap.set(d, node);
      nextNodes.push(node);
    }

    nodeCache.current = nextMap;
    return nextNodes;
  }, [center, leafIdFn]);

  const leafsTop = useMemo(() => {
    if (!top) return [];
    return top.map((x, i) => makeLeafNode(x, i, "top", leafIdFn ?? leafIdFallback));
  }, [leafIdFn, top]);

  const leafsBot = useMemo(() => {
    if (!bot) return [];
    return bot.map((x, i) => makeLeafNode(x, i, "bottom", leafIdFn ?? leafIdFallback));
  }, [bot, leafIdFn]);

  return [leafsTop, leafsCenter, leafsBot] as const;
}
