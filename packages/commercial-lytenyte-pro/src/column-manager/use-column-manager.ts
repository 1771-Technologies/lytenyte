import { useState, type Dispatch, type JSX, type SetStateAction } from "react";
import type { Column, Grid } from "../+types.js";
import { useVirtualizedTree } from "../tree-view/virtualized/use-virtualized-tree.js";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree.js";
import type { PathRoot } from "@1771technologies/lytenyte-shared";

export interface UseColumnManagerReturn<T> {
  readonly rootProps: {
    readonly grid: Grid<T>;
    readonly expansions: Record<string, boolean>;
    readonly onExpansionChange: Dispatch<SetStateAction<Record<string, boolean>>>;
    readonly treeRef: (el: HTMLElement | null) => void;
    readonly getAllIds: () => Set<string>;
    readonly getIdsBetweenNodes: (left: HTMLElement, right: HTMLElement) => string[];
    readonly onFocusChange: (el: HTMLElement | null) => void;
    readonly root: PathRoot<Column<T>>;
  };

  readonly tree: TreeVirtualItem<Column<T>>[];
  readonly spacer: JSX.Element;
}

export interface UseColumnManagerArgs<T> {
  readonly grid: Grid<T>;
  readonly itemHeight?: number;
}

export function useColumnManager<T>({
  grid,
  itemHeight = 24,
}: UseColumnManagerArgs<T>): UseColumnManagerReturn<T> {
  const [expansions, onExpansionChange] = useState<Record<string, boolean>>({});
  const columns = grid.state.columns.useValue();

  const virt = useVirtualizedTree({
    paths: columns,
    expansions,
    itemHeight,
    expansionDefault: true,
    nonAdjacentPathTrees: true,
  });

  return {
    rootProps: {
      grid,
      expansions,
      onExpansionChange,
      treeRef: virt.ref,
      ...virt.rootProps,
    },
    spacer: virt.spacer,
    tree: virt.virtualTree,
  };
}
