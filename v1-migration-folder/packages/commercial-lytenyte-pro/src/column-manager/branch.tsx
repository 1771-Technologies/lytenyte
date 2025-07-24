import type { JSX } from "react";
import { forwardRef, useMemo } from "react";
import type { TreeVirtualBranch } from "../tree-view/virtualized/make-virtual-tree";
import type { Column } from "../+types";
import { TreeBranch } from "../tree-view/branch/branch";
import type { SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { ColumnItemContext } from "./context";
import { DropWrap } from "@1771technologies/lytenyte-dragon";
import { useGrid } from "../grid-provider/use-grid";

export interface ColumnManagerBranchProps {
  readonly item: TreeVirtualBranch<Column<any>>;
  readonly label: SlotComponent;
  readonly expander?: SlotComponent;
}

export const Branch = forwardRef<
  HTMLLIElement,
  ColumnManagerBranchProps & JSX.IntrinsicElements["li"]
>(function ColumnManagerLeaf({ item, label, ...props }, forwarded) {
  const grid = useGrid();
  const id = grid.state.gridId.useValue();

  const accepted = `${id}/columns`;

  return (
    <ColumnItemContext value={useMemo(() => ({ item }), [item])}>
      <TreeBranch
        {...props}
        itemId={item.branch.id}
        ref={forwarded}
        {...item.attrs}
        label={<DropWrap accepted={[accepted]} as={label}></DropWrap>}
      ></TreeBranch>
    </ColumnItemContext>
  );
});
