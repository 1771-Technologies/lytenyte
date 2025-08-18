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
import type { PathBranch, PathLeaf } from "@1771technologies/lytenyte-shared";

export interface MoveHandleProps {
  readonly as?: SlotComponent;

  readonly placeholder?: (p: {
    columns: Column<any>[];
    item: PathBranch<Column<any>> | PathLeaf<Column<any>>;
  }) => ReactNode;
}

export const MoveHandle = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MoveHandleProps
>(function MoveHandle({ as, placeholder: Placeholder, ...props }, forwarded) {
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
      const move = p.dropElement.getAttribute("data-ln-column-id");
      if (!move) return null;

      if (columns.some((c) => c.id === move)) return;

      const allColumns = grid.state.columns.get();
      const moveIndex = allColumns.findIndex((c) => c.id === move);
      if (moveIndex === -1) return;

      const thisIndex = allColumns.findIndex((c) => c.id === columns[0].id);

      const isBefore = thisIndex > moveIndex;

      grid.api.columnMove({
        moveColumns: columns,
        moveTarget: move,
        before: isBefore,
      });
    },

    placeholder: () => {
      if (Placeholder) return <Placeholder columns={columns} item={item} />;

      return (
        <div>
          {item.kind === "branch" ? item.data.joinPath.at(-1)! : (item.data.name ?? item.data.id)}
        </div>
      );
    },
  });

  const combined = useCombinedRefs(ref, forwarded);
  const additionalProps = isMovable ? otherProps : {};

  const renderer = useSlot({
    props: [{ "aria-label": "Drag to move column" }, additionalProps, props],
    ref: isMovable ? combined : forwarded,
    slot: as ?? <div />,
  });

  return renderer;
});
