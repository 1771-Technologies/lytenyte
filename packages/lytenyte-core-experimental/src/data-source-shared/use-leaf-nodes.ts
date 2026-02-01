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

      const idFn = leafIdFn ?? leafIdFallback;
      const node = lookup.get(d) ?? makeLeafNode(d, i, "center");
      (node as any).__srcIndex = i;
      (node as any).id = idFn(d, i, "center");

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
      const node = makeLeafNode(x, i, "top");
      const idFn = leafIdFn ?? leafIdFallback;

      (node as any).__srcIndex = i;
      (node as any).id = idFn(x, i, "top");

      idMap.set(node.id, node);
      return node;
    });
    return [topNodes, idMap] as const;
  }, [leafIdFn, top]);

  const [leafsBot, botMap] = useMemo(() => {
    const idMap = new Map<string, RowLeaf<T>>();
    if (!bot) return [[] as RowLeaf<T>[], idMap] as const;

    const botNodes = bot.map((x, i) => {
      const idFn = leafIdFn ?? leafIdFallback;
      const node = makeLeafNode(x, i, "bottom");

      (node as any).__srcIndex = i;
      (node as any).id = idFn(x, i, "top");

      return node;
    });

    return [botNodes, idMap] as const;
  }, [bot, leafIdFn]);

  const pinMap = useMemo(() => {
    return new Map([...topMap, ...botMap]);
  }, [botMap, topMap]);

  return [leafsTop, leafsCenter, leafsBot, pinMap] as const;
}

const makeLeafNode = <T>(d: T, i: number, section: "top" | "center" | "bottom"): RowLeaf<T> =>
  ({
    kind: "leaf",
    data: d,
    depth: 0,
    id: "",
    __pin: section,
    __srcIndex: i,
  }) as RowLeaf<T>;
