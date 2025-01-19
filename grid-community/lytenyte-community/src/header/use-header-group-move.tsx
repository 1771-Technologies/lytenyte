import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { ColumnGroupRowItem, ColumnPin } from "@1771technologies/grid-types/community";
import { useDraggable } from "@1771technologies/react-dragon";
import { useMemo } from "react";

export function useHeaderGroupMove(
  api: ApiCommunityReact<any>,
  item: ColumnGroupRowItem,
  pin: ColumnPin,
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
      {c.label} | moving {c.cnt} columns
    </div>
  );
}
