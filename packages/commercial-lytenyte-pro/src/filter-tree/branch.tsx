import type { JSX } from "react";
import { forwardRef } from "react";
import type { TreeVirtualBranch } from "../tree-view/virtualized/make-virtual-tree";
import type { FilterInFilterItem } from "../+types";
import { TreeBranch } from "../tree-view/branch/branch.js";
import { FilterTreeItemContext } from "./context.js";
import { useTreeItem } from "./hooks/use-tree-item.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";

export interface FilterTreeBranch {
  readonly item: TreeVirtualBranch<FilterInFilterItem>;
  readonly label: SlotComponent;
  readonly labelWrap?: SlotComponent;
  readonly expander?: SlotComponent<{ expanded: boolean; toggle: () => void }>;
}

export const Branch = forwardRef<HTMLLIElement, FilterTreeBranch & JSX.IntrinsicElements["li"]>(
  function Branch({ item, labelWrap, label, ...props }, forwarded) {
    const value = useTreeItem(item);

    const labelSlot = useSlot({
      slot: labelWrap ?? <div />,
      props: [
        {
          onClick: () => value.onCheckChange(),
        },
      ],
    });

    return (
      <FilterTreeItemContext.Provider value={value}>
        <TreeBranch
          {...props}
          itemId={item.branch.data.id}
          ref={forwarded}
          {...item.attrs}
          onKeyDown={(ev) => {
            if (ev.key === " ") value.onCheckChange();
          }}
          label={label}
          labelWrap={labelSlot}
        />
      </FilterTreeItemContext.Provider>
    );
  },
);
