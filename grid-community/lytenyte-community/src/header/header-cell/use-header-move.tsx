import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import { dragState, useDraggable, useDroppable } from "@1771technologies/react-dragon";

export function useHeaderMove(
  api: ApiCoreReact<any>,
  column: ColumnCoreReact<any>,
  columnIndex: number,
) {
  const gridId = api.getState().gridId.use();
  const dragProps = useDraggable({
    dragData: () => ({ columns: [column], columnIndex }),
    dragTags: () => [`${gridId}:grid:${column.pin ?? "none"}`],
    placeholder: () => <DragPlaceholder column={column} />,
  });

  const { canDrop, isOver, ...dropProps } = useDroppable({
    tags: [`${gridId}:grid:${column.pin ?? "none"}`],
    onDrop: (p) => {
      const data = p.getData() as { columns: ColumnCoreReact<any>[]; columnIndex: number };
      const dragIndex = data.columnIndex;

      const isBefore = columnIndex < dragIndex;
      const src = data.columns.map((c) => c.id);
      const target = column.id;

      if (src.includes(target)) return;

      if (isBefore) api.columnMoveBefore(src, target);
      else api.columnMoveAfter(src, target);
    },
  });

  const dragData = dragState.dragData.use();
  const data = dragData?.();
  const dragIndex = ((data as any)?.columnIndex ?? -1) as number;
  const isBefore = columnIndex < dragIndex;

  const moveProps = api.columnIsMovable(column) ? dragProps : {};

  return { moveProps, dropProps, isBefore, canDrop, isOver, dragIndex };
}
function DragPlaceholder(c: { column: ColumnCoreReact<any> }) {
  return <div className="lng1771-drag-placeholder">{c.column.headerName ?? c.column.id}</div>;
}
