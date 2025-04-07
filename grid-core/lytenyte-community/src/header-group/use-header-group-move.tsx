import type { ColumnGroupRowItemCore, ColumnPinCore } from "@1771technologies/grid-types/core";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import { useDraggable } from "@1771technologies/react-dragon";
import { useMemo } from "react";

export function useHeaderGroupMove(
  api: ApiCoreReact<any>,
  item: ColumnGroupRowItemCore,
  pin: ColumnPinCore,
) {
  const sx = api.getState();
  const gridId = sx.gridId.use();
  const visible = sx.columnsVisible.use();

  const columns = useMemo(() => {
    return visible.slice(item.start, item.end);
  }, [item.end, item.start, visible]);

  const move = useDraggable({
    dragTags: () => [`${gridId}:grid:${pin ?? "none"}`],
    dragData: () => ({ columns, columnIndex: item.start }),
    placeholder: () => (
      <DragPlaceholder
        cnt={item.end - item.start}
        label={item.id.split(sx.columnGroupIdDelimiter.peek()).at(-1)!}
      />
    ),
  });

  const isMovable = columns.every((c) => api.columnIsMovable(c));

  return { moveProps: isMovable ? move : {} };
}

function DragPlaceholder(c: { label: string; cnt: number }) {
  return (
    <div className="lng1771-drag-placeholder">
      {c.label} | moving {c.cnt} columns
    </div>
  );
}
