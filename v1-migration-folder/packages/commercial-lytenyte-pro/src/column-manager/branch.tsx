import type { JSX } from "react";
import { forwardRef, useMemo } from "react";
import type { TreeVirtualBranch } from "../tree-view/virtualized/make-virtual-tree";
import type { Column } from "../+types";
import { TreeBranch } from "../tree-view/branch/branch";
import type { SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { ColumnItemContext } from "./context";
import { dragState, DropWrap } from "@1771technologies/lytenyte-dragon";
import { useGrid } from "../grid-provider/use-grid";
import { useColumnsFromContext } from "./use-columns-from-context";

export interface ColumnManagerBranchProps {
  readonly item: TreeVirtualBranch<Column<any>>;
  readonly label: SlotComponent;
  readonly expander?: SlotComponent;
}

export const Branch = forwardRef<
  HTMLLIElement,
  ColumnManagerBranchProps & JSX.IntrinsicElements["li"]
>(function Branch({ item, label, ...props }, forwarded) {
  const grid = useGrid();
  const id = grid.state.gridId.useValue();

  const accepted = `${id}/columns`;

  const columns = useColumnsFromContext(item);

  return (
    <ColumnItemContext value={useMemo(() => ({ item }), [item])}>
      <TreeBranch
        {...props}
        itemId={item.branch.data.idOccurrence}
        ref={forwarded}
        {...item.attrs}
        labelWrap={
          <DropWrap
            data-ln-column-manager-branch
            data-ln-column-id={item.branch.data.idOccurrence}
            accepted={[accepted]}
            onEnter={(el) => {
              const data = dragState.data
                .get()
                ?.siteLocalData?.[accepted]?.at(-1) as Column<any> | null;

              if (!data) return;

              const move = data.id;
              if (columns.some((c) => c.id === move)) return;

              const allColumns = grid.state.columns.get();
              const moveIndex = allColumns.findIndex((c) => c.id === move);
              if (moveIndex === -1) return;

              const thisIndex = allColumns.findIndex((c) => c.id === columns[0].id);

              const isBefore = thisIndex > moveIndex;

              if (isBefore) {
                el.setAttribute("data-ln-is-before", "true");
              } else {
                el.setAttribute("data-ln-is-after", "true");
              }
            }}
            onLeave={(el) => {
              el.removeAttribute("data-ln-is-before");
              el.removeAttribute("data-ln-is-after");
            }}
          />
        }
        label={label}
      />
    </ColumnItemContext>
  );
});
