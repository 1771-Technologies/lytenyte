import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import { dragState, useDraggable, useDroppable } from "@1771technologies/react-dragon";

export function useHeaderMove(
  api: ApiCoreReact<any>,
  column: ColumnCoreReact<any>,
  columnIndex: number,
) {
  const gridId = api.getState().gridId.use();
  const dragProps = useDraggable({
    onDragStart: () => {
      document.body.classList.add("lng1771-drag-on");
    },
    onDragEnd: () => {
      document.body.classList.remove("lng1771-drag-on");
    },
    onDragCancel: () => {
      document.body.classList.remove("lng1771-drag-on");
    },
    dragData: () => ({ columns: [column], columnIndex }),
    dragTags: () => {
      const c = [`${gridId}:grid:${column.pin ?? "none"}`];

      const groupable = api.columnIsRowGroupable(column);
      const isGrouped = api.getState().rowGroupModel.peek().includes(column.id);
      if (groupable && !isGrouped) c.push(`${gridId}:grid:groupable`);

      return c;
    },
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
  return (
    <div className="lng1771-pill-manager__drag-placeholder--default">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        fill="currentcolor"
        viewBox="0 0 256 256"
      >
        <path d="M90.34,61.66a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,43.31V96a8,8,0,0,1-16,0V43.31L101.66,61.66A8,8,0,0,1,90.34,61.66Zm64,132.68L136,212.69V160a8,8,0,0,0-16,0v52.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm83.32-72-32-32a8,8,0,0,0-11.32,11.32L212.69,120H160a8,8,0,0,0,0,16h52.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,237.66,122.34ZM43.31,136H96a8,8,0,0,0,0-16H43.31l18.35-18.34A8,8,0,0,0,50.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32Z"></path>
      </svg>
      <span>{c.column.headerName ?? c.column.id}</span>
    </div>
  );
}
