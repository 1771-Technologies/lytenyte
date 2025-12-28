import { forwardRef, useMemo, type JSX } from "react";
import { useColumnItemContext } from "./context.js";
import { useColumnsFromContext } from "./use-columns-from-context.js";
import { useGrid } from "../grid-provider/use-grid.js";
import {
  useCombinedRefs,
  useDraggable,
  useSlot,
  type SlotComponent,
} from "@1771technologies/lytenyte-core/yinternal";

export interface MoveHandleProps {
  readonly as?: SlotComponent;
}

export const MoveHandle = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & MoveHandleProps>(
  function MoveHandle({ as, ...props }, forwarded) {
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
        const gridId = grid.state.gridId.get();
        const isGroupable =
          columns.length === 1 && (columns[0].uiHints?.rowGroupable ?? base.uiHints?.rowGroupable);

        if (isGroupable) {
          return {
            siteLocalData: {
              [`${gridId}-columns`]: columns,
              [`${gridId}-group`]: columns[0].id,
            },
          };
        }

        return {
          siteLocalData: {
            [`${gridId}-columns`]: columns,
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

      placeholder: (_, el) => {
        let current = el;
        while (
          current &&
          !current.getAttribute("data-ln-column-manager-leaf") &&
          !current.getAttribute("data-ln-tree-branch")
        ) {
          current = current.parentElement as HTMLElement;
        }

        if (current) return current;
        else return el;
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
  },
);
