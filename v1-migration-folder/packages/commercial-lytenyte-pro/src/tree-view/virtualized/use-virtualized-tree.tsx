import { type PathProvidedItem } from "@1771technologies/lytenyte-shared";
import { useEvent, useMeasure } from "@1771technologies/lytenyte-react-hooks";
import { useMemo, useState } from "react";
import { buildVirtualTreePartial } from "./get-virtual-tree-paths.js";
import { makeVirtualTree } from "./make-virtual-tree.js";
import { useFlattenedTree } from "./use-flattened-tree.js";
import { useRowStartAndEnd } from "./use-row-start-and-end.js";
import { getTreeNodeId } from "../utils/get-tree-node-id.js";

export interface VirtualizedTreeViewPathsArgs<T extends PathProvidedItem> {
  readonly itemHeight: number;
  readonly expansions: Record<string, boolean>;
  readonly expansionDefault?: boolean;
  readonly paths: T[];
  readonly nonAdjacentPathTrees?: boolean;
}

export function useVirtualizedTree<T extends PathProvidedItem>({
  itemHeight,
  expansions,
  expansionDefault = false,
  nonAdjacentPathTrees,
  paths,
}: VirtualizedTreeViewPathsArgs<T>) {
  const [ref, bounds, _, panel] = useMeasure({ scroll: true });

  const { flat, nodeToIndex, indexToId, allIds, idToNode } = useFlattenedTree(
    paths,
    expansions,
    expansionDefault,
    nonAdjacentPathTrees,
  );

  const size = useMemo(() => flat.length, [flat.length]);

  const [rowStart, rowEnd] = useRowStartAndEnd(panel as HTMLElement, itemHeight, bounds, size);
  const [focused, setFocused] = useState<string | null>(null);

  const virtualTree = useMemo(() => {
    const items = flat.slice(rowStart, rowEnd);
    if (!items.length) return [];

    // Ensure that the parent nodes of the current tree in view are added as well. This ensure that
    // the nodes are always visible.
    while (items[0].parent.kind !== "root") {
      items.unshift(items[0].parent);
    }

    // Ensure that the first node is always in the list of tree nodes so the home key works fine.
    if (rowStart !== 0 && items[0] !== flat[0]) items.unshift(flat[0]);

    // Ensure the last node is always in the list of nodes present.
    if (rowEnd !== flat.length) {
      const endItems = [flat.at(-1)!];
      while (endItems[0].parent.kind !== "root" && endItems[0].parent !== items.at(-1)) {
        endItems.unshift(endItems[0].parent);
      }

      items.push(...endItems);
    }

    // Finally we need to ensure the focused node is present. We add the node before and after
    // the current node - so that the next and previous node are selectable.
    if (focused && idToNode.has(focused)) {
      const node = idToNode.get(focused)!;
      const index = nodeToIndex.get(node)!;

      const nextId = indexToId.get(index + 1)!;
      const prevId = indexToId.get(index - 1)!;
      const next = idToNode.get(nextId);
      const prev = idToNode.get(prevId);

      if (!items.includes(node)) {
        const firstIndexGreater = items.findIndex((c) => nodeToIndex.get(c)! > index);
        items.splice(firstIndexGreater, 0, node);
      }
      if (next && !items.includes(next)) {
        const firstIndexGreater = items.findIndex((c) => nodeToIndex.get(c)! > index + 1);
        items.splice(firstIndexGreater, 0, next);
      }
      if (prev && !items.includes(prev)) {
        const firstIndexGreater = items.findIndex((c) => nodeToIndex.get(c)! > index - 1);
        items.splice(firstIndexGreater, 0, prev);
      }
    }

    const subtreePaths = buildVirtualTreePartial(items);
    const subtree = makeVirtualTree(
      subtreePaths,
      nodeToIndex,
      itemHeight,
      nonAdjacentPathTrees ?? false,
    );

    return subtree;
  }, [
    flat,
    focused,
    idToNode,
    indexToId,
    itemHeight,
    nodeToIndex,
    nonAdjacentPathTrees,
    rowEnd,
    rowStart,
  ]);

  const spacer = <div style={{ height: size * itemHeight, width: 0 }} />;

  const onFocusChange = useEvent((el: HTMLElement | null) => {
    setFocused(el ? getTreeNodeId(el) : null);
  });

  const getAllIds = useEvent(() => allIds);
  const getIdsBetweenNodes = useEvent((left: HTMLElement, right: HTMLElement) => {
    const leftIndex = Number.parseInt(left.getAttribute("data-ln-row-index")!);
    const rightIndex = Number.parseInt(right.getAttribute("data-ln-row-index")!);

    const [start, end] = leftIndex < rightIndex ? [leftIndex, rightIndex] : [rightIndex, leftIndex];

    if (start === end) return [indexToId.get(start)!];

    const ids: string[] = [];
    for (let i = start; i <= end; i++) {
      ids.push(indexToId.get(i)!);
    }

    return ids;
  });

  return {
    ref,
    virtualTree,
    spacer,
    rootProps: {
      getAllIds,
      getIdsBetweenNodes,
      onFocusChange,
    },
  };
}
