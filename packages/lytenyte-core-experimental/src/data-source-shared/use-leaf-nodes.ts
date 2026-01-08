import type { LeafIdFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo, useRef } from "react";

export type LeafNodeTuple<T> = ReturnType<typeof useLeafNodes<T>>;

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
      (node as any).__srcIndex = i;

      nextMap.set(d, node);
      nextNodes.push(node);
    }

    nodeCache.current = nextMap;
    return nextNodes;
  }, [center, leafIdFn]);

  const [leafsTop, topMap] = useMemo(() => {
    const idMap = new Map<string, RowLeaf<T>>();
    if (!top) return [[] as RowLeaf<T>[], idMap] as const;

    const topNodes = top.map((x, i) => {
      const node = makeLeafNode(x, i, "top", leafIdFn ?? leafIdFallback);
      (node as any).__srcIndex = i;

      idMap.set(node.id, node);
      return node;
    });
    return [topNodes, idMap] as const;
  }, [leafIdFn, top]);

  const [leafsBot, botMap] = useMemo(() => {
    const idMap = new Map<string, RowLeaf<T>>();
    if (!bot) return [[] as RowLeaf<T>[], idMap] as const;

    const botNodes = bot.map((x, i) => {
      const node = makeLeafNode(x, i, "bottom", leafIdFn ?? leafIdFallback);
      (node as any).__srcIndex = i;

      return node;
    });

    return [botNodes, idMap] as const;
  }, [bot, leafIdFn]);

  const pinMap = useMemo(() => {
    return new Map([...topMap, ...botMap]);
  }, [botMap, topMap]);

  return [leafsTop, leafsCenter, leafsBot, pinMap] as const;
}

const makeLeafNode = <T>(
  d: T,
  i: number,
  section: "top" | "center" | "bottom",
  leafIdFn: LeafIdFn<T>,
): RowLeaf<T> =>
  ({
    kind: "leaf",
    data: d,
    depth: 0,
    id: leafIdFn(d, i, section),
    __pin: section,
    __srcIndex: i,
  }) as RowLeaf<T>;
