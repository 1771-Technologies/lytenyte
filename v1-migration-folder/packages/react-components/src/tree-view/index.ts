import { TreeBranch } from "./branch/branch";
import { useTreeViewPaths } from "./hooks/use-tree-view-paths";
import { TreeLeaf } from "./leaf";
import { TreePanel } from "./panel/panel";
import { TreeRoot } from "./root";
import { ForceSyncScrolling } from "./virtualized/force-sync-scrolling";
import { useVirtualizedTree } from "./virtualized/use-virtualized-tree";

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
