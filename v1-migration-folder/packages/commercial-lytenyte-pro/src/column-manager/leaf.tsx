import type { JSX } from "react";
import { forwardRef, useMemo } from "react";
import type { TreeVirtualLeaf } from "../tree-view/virtualized/make-virtual-tree";
import { ColumnItemContext } from "./context";
import { TreeLeaf } from "../tree-view/leaf";
import type { Column } from "../+types";
import { DropWrap } from "@1771technologies/lytenyte-dragon";
import { useGrid } from "../grid-provider/use-grid";

export interface ColumnManagerLeafProps {
  readonly item: TreeVirtualLeaf<Column<any>>;
}

export const Leaf = forwardRef<HTMLLIElement, ColumnManagerLeafProps & JSX.IntrinsicElements["li"]>(
  function ColumnManagerLeaf({ item, ...props }, forwarded) {
    const context = useMemo(() => {
      return { item: item };
    }, [item]);

    const grid = useGrid();
    const id = grid.state.gridId.useValue();

    const accepted = `${id}/columns`;

    return (
      <ColumnItemContext.Provider value={context}>
        <DropWrap
          accepted={[accepted]}
          as={
            <TreeLeaf
              {...props}
              itemId={item.leaf.data.id}
              ref={forwarded}
              {...item.attrs}
              style={{ ...props.style, ...item.attrs.style }}
            />
          }
        />
      </ColumnItemContext.Provider>
    );
  },
);
