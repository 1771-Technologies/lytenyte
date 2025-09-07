import type { JSX } from "react";
import { forwardRef } from "react";
import type { TreeVirtualLeaf } from "../tree-view/virtualized/make-virtual-tree";
import { TreeLeaf } from "../tree-view/leaf.js";
import type { FilterInFilterItem } from "../+types";
import { FilterTreeItemContext } from "./context.js";
import { useTreeItem } from "./hooks/use-tree-item.js";

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
          onClick={() => value.onCheckChange()}
          onKeyDown={(ev) => {
            if (ev.key === " ") {
              ev.preventDefault();
              value.onCheckChange();
            }
          }}
        />
      </FilterTreeItemContext.Provider>
    );
  },
);
