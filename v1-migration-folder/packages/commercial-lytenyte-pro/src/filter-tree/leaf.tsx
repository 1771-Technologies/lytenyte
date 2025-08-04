import type { JSX } from "react";
import { forwardRef } from "react";
import type { TreeVirtualLeaf } from "../tree-view/virtualized/make-virtual-tree";
import { TreeLeaf } from "../tree-view/leaf";
import type { FilterInFilterItem } from "../+types";
import { FilterTreeItemContext } from "./context";
import { useTreeItem } from "./use-tree-item";

export interface FilterTreeLeafProps {
  readonly item: TreeVirtualLeaf<FilterInFilterItem>;
}

export const Leaf = forwardRef<HTMLLIElement, FilterTreeLeafProps & JSX.IntrinsicElements["li"]>(
  function Leaf({ item, ...props }, forwarded) {
    const value = useTreeItem(item);

    return (
      <FilterTreeItemContext.Provider value={value}>
        <TreeLeaf
          {...props}
          itemId={item.leaf.data.id}
          ref={forwarded}
          {...item.attrs}
          style={{ ...props.style, ...item.attrs.style }}
        />
      </FilterTreeItemContext.Provider>
    );
  },
);
