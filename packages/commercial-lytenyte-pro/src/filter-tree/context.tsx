import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import type { FilterIn, FilterInFilterItem } from "../+types";

export interface TreeItemContextValue {
  readonly item: TreeVirtualItem<FilterInFilterItem>;
  readonly onCheckChange: (b?: boolean) => void;
  readonly isChecked: boolean;
  readonly isIndeterminate: boolean;
}

export const FilterTreeContext = createContext<{
  items: FilterInFilterItem[];
  pivotMode: boolean;
  columnId: string;
  filter: FilterIn;
  filterChange: Dispatch<SetStateAction<FilterIn>>;
  applyChangesImmediately: boolean;
}>(null as any);
export const useTreeContext = () => useContext(FilterTreeContext);

export const FilterTreeItemContext = createContext<TreeItemContextValue>(null as any);

export const useTreeItemContext = () => useContext(FilterTreeItemContext);
