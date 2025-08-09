import { TreePanel } from "../tree-view/panel/panel.js";
import { ForceSyncScrolling } from "../tree-view/virtualized/force-sync-scrolling.js";
import { Branch } from "./branch.js";
import { InclusionCheckbox } from "./inclusion-checkbox.js";
import { Label } from "./label.js";
import { Leaf } from "./leaf.js";
import { Root } from "./root.js";
import { useFilterTree } from "./hooks/use-filter-tree.js";

export const FilterTree = {
  Root,
  Panel: TreePanel,
  PassiveScroll: ForceSyncScrolling,
  Leaf: Leaf,
  Branch: Branch,
  Label: Label,
  Checkbox: InclusionCheckbox,

  useFilterTree,
};
