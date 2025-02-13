import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { dragState, useDraggable, useDroppable } from "@1771technologies/react-dragon";

export function useHeaderMove(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
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
      const data = p.getData() as { columns: ColumnCommunityReact<any>[]; columnIndex: number };
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
function DragPlaceholder(c: { column: ColumnCommunityReact<any> }) {
  return (
    <div
      className={css`
        background-color: ${t.colors.backgrounds_light};
        padding: ${t.spacing.space_10} ${t.spacing.space_40};
        border: 1px solid ${t.colors.primary_50};
        border-radius: ${t.spacing.box_radius_medium};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
      `}
    >
      {c.column.headerName ?? c.column.id}
    </div>
  );
}
