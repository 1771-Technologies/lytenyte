import type { DragProps } from "@1771technologies/lytenyte-dragon";
import {
  getHoveredColumnIndex,
  getNearestFocusable,
  useDraggable,
} from "@1771technologies/lytenyte-shared";
import type {
  Column,
  Grid,
  HeaderCellFloating,
  HeaderCellLayout,
  HeaderGroupCellLayout,
} from "../+types.js";
import { useMemo, useRef, type JSX } from "react";
import type { InternalAtoms } from "../state/+types.js";

export function useDragMove<T>(
  grid: Grid<T> & { internal: InternalAtoms },
  cell: HeaderGroupCellLayout | HeaderCellLayout<T> | HeaderCellFloating<T>,
  onDragStart?: JSX.IntrinsicElements["div"]["onDragStart"],
) {
  const ctx = grid.state;

  const meta = ctx.columnMeta.useValue();
  const base = ctx.columnBase.useValue();

  const columns = useMemo(() => {
    const columns: Column<any>[] = [];
    for (let i = cell.colStart; i < cell.colEnd; i++) {
      columns.push(meta.columnsVisible[i]);
    }

    return columns;
  }, [cell.colEnd, cell.colStart, meta.columnsVisible]);

  const isMovable = useMemo(() => {
    return columns.every((c) => c.uiHints?.movable ?? base.uiHints?.movable ?? false);
  }, [base.uiHints?.movable, columns]);

  const swapDirection = useRef<null | boolean>(null);
  const swapIndex = useRef(-1);
  const swapPrevIndex = useRef(-1);
  const isForward = useRef(false);
  const prevPos = useRef(-1);

  const { dragProps } = useDraggable({
    getItems: () => ({}),
    onDragStart: () => {
      if (cell.kind === "group") grid.internal.draggingHeader.set(cell);
    },
    onDragEnd: () => {
      grid.internal.draggingHeader.set(null);
    },
    onDragMove: (p) => {
      const element = document.elementFromPoint(p.position.x, p.position.y);
      const vp = grid.state.viewport.get();
      if (!vp?.contains(element)) return;

      const nearest = getNearestFocusable(element as HTMLElement);
      if (!nearest) return;

      if (prevPos.current < p.position.x) isForward.current = true;
      if (prevPos.current > p.position.x) isForward.current = false;

      prevPos.current = p.position.x;

      const meta = grid.state.columnMeta.get();

      const index = getHoveredColumnIndex({
        viewport: vp,
        centerCount: meta.columnVisibleCenterCount,
        startCount: meta.columnVisibleStartCount,
        endCount: meta.columnVisibleEndCount,
        clientX: p.position.x,
        rtl: grid.state.rtl.get(),
        xPositions: grid.state.xPositions.get(),
      });

      if (index == null) return;

      const first = columns[0];

      const currentIndex = grid.api.columnIndex(first);
      const columnIndices = columns.map((c) => grid.api.columnIndex(c));
      if (columnIndices.includes(index)) return;

      const ignoreMove =
        swapDirection.current === isForward.current &&
        swapIndex.current === currentIndex &&
        index === swapPrevIndex.current;

      if (currentIndex === index || ignoreMove) return;

      swapDirection.current = isForward.current;
      swapIndex.current = index;
      swapPrevIndex.current = currentIndex;

      grid.api.columnMove({
        moveColumns: columns,
        moveTarget: index,
        before: currentIndex > index,
        updatePinState: true,
      });
    },
  });

  const finalProps = useMemo(() => {
    if (cell.kind === "floating" || !isMovable) return {};

    return {
      draggable: true,
      onDragStart: (e) => {
        onDragStart?.(e as any);
        dragProps.onDragStart(e);
      },
      ref: dragProps.ref,
    } satisfies DragProps;
  }, [cell.kind, dragProps, isMovable, onDragStart]);

  return finalProps;
}
