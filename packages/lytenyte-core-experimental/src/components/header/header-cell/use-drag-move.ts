import {
  COLUMN_MARKER_ID,
  getHoveredColumnIndex,
  getNearestFocusable,
  GROUP_COLUMN_PREFIX,
  type ColumnAbstract,
  type LayoutHeaderCell,
  type LayoutHeaderFloating,
  type LayoutHeaderGroup,
} from "@1771technologies/lytenyte-shared";
import { useMemo, useRef, type DragEvent, type JSX } from "react";
import { useDraggable } from "../../../dnd/use-draggable.js";
import { useHeader } from "../header-context.js";
import { useRoot } from "../../../root/root-context.js";
import { HeaderMovePlaceholder } from "./header-move-placer.js";

export function useDragMove(
  cell: LayoutHeaderGroup | LayoutHeaderCell | LayoutHeaderFloating,
  onDragStart?: JSX.IntrinsicElements["div"]["onDragStart"],
) {
  const {
    view,
    viewport: vp,
    base,
    id,
    rtl,
    xPositions,
    api,
    columnGroupMoveDragPlaceholder,
    columnMoveDragPlaceholder,
    onColumnMoveOutside,
  } = useRoot();

  const placeholderSetting =
    cell.kind === "group" ? columnGroupMoveDragPlaceholder : columnMoveDragPlaceholder;

  let dragPlaceholder;
  if (typeof placeholderSetting === "function") dragPlaceholder = HeaderMovePlaceholder;
  else dragPlaceholder = placeholderSetting;

  const viewRef = useRef(view);
  viewRef.current = view;

  const { setActiveHeaderDrag } = useHeader();
  const columns = useMemo(() => {
    const columns: ColumnAbstract[] = [];
    for (let i = cell.colStart; i < cell.colEnd; i++) {
      columns.push(view.visibleColumns[i]);
    }
    return columns;
  }, [cell.colEnd, cell.colStart, view.visibleColumns]);

  const isMovable = useMemo(() => {
    return columns.every(
      (c) =>
        !c.id.startsWith(GROUP_COLUMN_PREFIX) &&
        c.id !== COLUMN_MARKER_ID &&
        (c.movable ?? base.movable ?? false),
    );
  }, [base.movable, columns]);

  const swapDirection = useRef<null | boolean>(null);
  const swapIndex = useRef(-1);
  const swapPrevIndex = useRef(-1);
  const isForward = useRef(false);
  const prevPos = useRef(-1);

  const { props, isDragActive, placeholder } = useDraggable({
    placeholder: dragPlaceholder as any,
    data: {
      moving: { kind: "site", data: { columns, cell } },
    },
    onUnhandledDrop: ({ position: { x, y } }) => {
      if (!onColumnMoveOutside || !vp) return;
      const bb = vp.getBoundingClientRect();

      const isOutside = bb.top >= y || bb.bottom <= y || bb.left >= x || bb.right <= x;
      if (!isOutside) return;

      setActiveHeaderDrag(null);
      onColumnMoveOutside?.({ columns, api });
    },
    onDragStart: () => {
      if (cell.kind === "group") setActiveHeaderDrag(cell);
    },
    onDragEnd: () => {
      setActiveHeaderDrag(null);
    },
    onDragMove: (p) => {
      const element = document.elementFromPoint(p.position.x, p.position.y);
      if (!vp?.contains(element)) return;

      const nearest = getNearestFocusable(id, element as HTMLElement);
      if (!nearest) return;

      if (prevPos.current < p.position.x) isForward.current = true;
      if (prevPos.current > p.position.x) isForward.current = false;

      prevPos.current = p.position.x;
      const view = viewRef.current;

      const index = getHoveredColumnIndex({
        viewport: vp,
        centerCount: view.centerCount,
        startCount: view.startCount,
        endCount: view.endCount,
        clientX: p.position.x,
        rtl,
        xPositions,
      });

      if (index == null) return;
      const columnTarget = api.columnByIndex(index);
      if (columnTarget) {
        if (columnTarget.id === COLUMN_MARKER_ID || columnTarget.id.startsWith(GROUP_COLUMN_PREFIX)) return;
      }

      const first = columns[0];

      const currentIndex = view.visibleColumns.findIndex((x) => x.id === first.id);
      const columnIndices = columns.map((c) => view.visibleColumns.findIndex((x) => x.id === c.id));
      if (columnIndices.includes(index)) return;

      const ignoreMove =
        swapDirection.current === isForward.current &&
        swapIndex.current === currentIndex &&
        index === swapPrevIndex.current;

      if (currentIndex === index || ignoreMove) return;

      swapDirection.current = isForward.current;
      swapIndex.current = index;
      swapPrevIndex.current = currentIndex;

      api.columnMove({
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
      draggable: props.draggable,
      onDragStart: (e: DragEvent) => {
        onDragStart?.(e as any);
        props.onDragStart?.(e);
      },
    };
  }, [cell.kind, isMovable, onDragStart, props]);

  return { props: finalProps, isDragActive, placeholder };
}
