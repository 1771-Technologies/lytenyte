import type { JSX } from "react";
import { forwardRef } from "react";
import type { TreeVirtualBranch } from "../tree-view/virtualized/make-virtual-tree";
import type { FilterInFilterItem } from "../+types";
import { TreeBranch } from "../tree-view/branch/branch";
import type { SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { FilterTreeItemContext } from "./context";
import { useTreeItem } from "./use-tree-item";

export interface FilterTreeBranch {
  readonly item: TreeVirtualBranch<FilterInFilterItem>;
  readonly label: SlotComponent;
  readonly expander?: SlotComponent;
}

export const Branch = forwardRef<HTMLLIElement, FilterTreeBranch & JSX.IntrinsicElements["li"]>(
  function Branch({ item, label, ...props }, forwarded) {
    const value = useTreeItem(item);

    return (
      <FilterTreeItemContext.Provider value={value}>
        <TreeBranch
          {...props}
          itemId={item.branch.data.idOccurrence}
          ref={forwarded}
          {...item.attrs}
          label={label}
        />
      </FilterTreeItemContext.Provider>
    );
  },
);
