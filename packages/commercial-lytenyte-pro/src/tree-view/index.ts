import { TreeBranch } from "./branch/branch.js";
import { useTreeViewPaths } from "./hooks/use-tree-view-paths.js";
import { TreeLeaf } from "./leaf.js";
import { TreePanel } from "./panel/panel.js";
import { TreeRoot } from "./root.js";
import { ForceSyncScrolling } from "./virtualized/force-sync-scrolling.js";
import { useVirtualizedTree } from "./virtualized/use-virtualized-tree.js";

export const Tree = {
  Leaf: TreeLeaf,
  Branch: TreeBranch,
  Root: TreeRoot,
  Panel: TreePanel,

  usePaths: useTreeViewPaths,
  useVirtualTree: useVirtualizedTree,
  ForceSyncScrolling,
};

export type { TreeRootProps } from "./root.js";
export type { TreeBranchProps } from "./branch/branch.js";
export type { TreeLeafProps } from "./leaf.js";
export type { VirtualizedTreeViewPathsArgs } from "./virtualized/use-virtualized-tree.js";
