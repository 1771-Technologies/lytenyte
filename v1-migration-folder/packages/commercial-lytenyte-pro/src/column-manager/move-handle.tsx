import { useDraggable } from "@1771technologies/lytenyte-dragon";
import {
  useCombinedRefs,
  useSlot,
  type SlotComponent,
} from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { useColumnItemContext } from "./context";
import { useColumnsFromContext } from "./use-columns-from-context";
import { useGrid } from "../grid-provider/use-grid";
import type { Column } from "../+types";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";

export interface MoveHandleProps {
  readonly slot?: SlotComponent;

  readonly placeholder?: (p: {
    columns: Column<any>[];
    item: TreeVirtualItem<Column<any>>;
  }) => ReactNode;
}

export const MoveHandle = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MoveHandleProps
>(function MoveHandle({ slot, placeholder: Placeholder, ...props }, forwarded) {
  const item = useColumnItemContext().item;
  const grid = useGrid();

  const columns = useColumnsFromContext(item);
  const base = grid.state.columnBase.useValue();

  const isMovable = useMemo(() => {
    return columns.every((c) => c.uiHints?.movable ?? base.uiHints?.movable);
  }, [base.uiHints?.movable, columns]);

  const {
    dragProps: { ref, ...otherProps },
  } = useDraggable({
    getItems: () => {
      return {
        siteLocalData: {
          [`${grid.state.gridId.get()}/columns`]: columns,
        },
      };
    },

    onDrop: (p) => {
      console.log(p);
    },

    placeholder: () => {
      if (Placeholder) return <Placeholder columns={columns} item={item} />;

      return (
        <div>
          {item.kind === "branch"
            ? item.branch.data.joinPath.at(-1)!
            : (item.leaf.data.name ?? item.leaf.data.id)}
        </div>
      );
    },
  });

  const combined = useCombinedRefs(ref, forwarded);
  const additionalProps = isMovable ? otherProps : {};

  const renderer = useSlot({
    props: [additionalProps, props],
    ref: isMovable ? combined : forwarded,
    slot: slot ?? <div />,
  });

  return renderer;
});
