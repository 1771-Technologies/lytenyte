import { TreePanel } from "../tree-view/panel/panel";
import { ForceSyncScrolling } from "../tree-view/virtualized/force-sync-scrolling";
import { Branch } from "./branch";
import { Label } from "./label";
import { Leaf } from "./leaf";
import { MoveHandle } from "./move-handle";
import { Root } from "./root";
import { useColumnManager } from "./use-column-manager";
import { VisibilityCheckbox } from "./visibility-checkbox";

export const ColumnManager = {
  Root: Root,
  Panel: TreePanel,
  PassiveScroll: ForceSyncScrolling,

  Leaf,
  Branch,
  Label,
  VisibilityCheckbox,
  MoveHandle,

  useColumnManager,
};
