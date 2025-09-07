import { forwardRef, type JSX } from "react";
import type { HeaderGroupCellLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { HeaderGroupCellReact } from "@1771technologies/lytenyte-shared";
import { fastDeepMemo, useCombinedRefs } from "@1771technologies/lytenyte-react-hooks";
import { useDragMove } from "./use-drag-move.js";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

const HeaderGroupCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderGroupCellProps
>(function HeaderCell({ cell, children, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const ctx = grid.state;

  const { ref, ...dragProps } = useDragMove(grid, cell, props.onDragStart);

  const combined = useCombinedRefs(ref, forwarded);

  const isExpanded =
    grid.state.columnGroupExpansions.useValue()[cell.id] ??
    grid.state.columnGroupDefaultExpansion.get();

  return (
    <HeaderGroupCellReact
      {...props}
      {...dragProps}
      ref={combined}
      cell={cell}
      cellId={cell.id}
      height={ctx.headerGroupHeight.useValue()}
      rtl={ctx.rtl.useValue()}
      viewportWidth={ctx.viewportWidthInner.useValue()}
      xPositions={ctx.xPositions.useValue()}
      isHiddenMove={cell.isHiddenMove ?? false}
      data-ln-collapsible={cell.isCollapsible}
      data-ln-collapsed={!isExpanded}
    >
      {children == undefined ? cell.id : children}
    </HeaderGroupCellReact>
  );
});

export const HeaderGroupCell = fastDeepMemo(HeaderGroupCellImpl);
