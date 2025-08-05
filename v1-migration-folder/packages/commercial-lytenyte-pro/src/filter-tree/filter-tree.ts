import { TreePanel } from "../tree-view/panel/panel";
import { ForceSyncScrolling } from "../tree-view/virtualized/force-sync-scrolling";
import { Branch } from "./branch";
import { InclusionCheckbox } from "./inclusion-checkbox";
import { Label } from "./label";
import { Leaf } from "./leaf";
import { Root } from "./root";
import { useFilterTree } from "./hooks/use-filter-tree";

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
