import { createContext, useContext } from "react";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import type { Column } from "../+types";

export interface TreeItemContextValue {
  readonly item: TreeVirtualItem<Column<any>>;
}

export const ColumnItemContext = createContext<TreeItemContextValue>(null as any);

export const useColumnItemContext = () => useContext(ColumnItemContext);
