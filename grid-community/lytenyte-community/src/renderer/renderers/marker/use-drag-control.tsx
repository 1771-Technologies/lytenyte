import { getHoveredRowIndex } from "@1771technologies/grid-core";
import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowDragEventParams, RowNode } from "@1771technologies/grid-types/community";
import { clsx, getClientX, getClientY, getRelativeXPosition } from "@1771technologies/js-utils";
import { useDraggable } from "@1771technologies/react-dragon";

export function useDragControl(api: ApiCommunityReact<any>, row: RowNode<any>) {
  const draggable = useDraggable({
    dragData: () => ({ row }),
    dragTags: () => {
      const sx = api.getState();
      const id = sx.gridId.peek();
      const externalGrids = sx.rowDragExternalGrids.peek();
      const externalIds = externalGrids.map((c) => c.getState().gridId.peek());

      return [id, ...externalIds].map((c) => `${c}:row-drag`);
    },
    onDragStart: (ev) => {
      const controller = new AbortController();

      const startY = getClientY(ev.event);
      const updates = [startY, startY];
      let anim: number | null = null;

      const sx = api.getState();
      const viewport = sx.internal.viewport.peek();

      const ref: RowDragEventParams<ApiCommunityReact<any>, any> = {
        event: ev.event,
        api,
        rows: [row],
        overIndex: -1,
        y: startY,
      };

      api.eventFire("onRowDragStart", ref);

      document.addEventListener(
        "drag",
        (ev) => {
          const clientX = getClientX(ev);
          const clientY = getClientY(ev);
          ev.preventDefault();

          [updates[0], updates[1]] = [updates[1], clientY];
          if (updates[0] === clientY) return;

          if (anim) cancelAnimationFrame(anim);
          anim = requestAnimationFrame(() => {
            const relative = getRelativeXPosition(viewport!, clientX);
            const isOutOfBounds = relative.left < 0 || relative.right < 0;

            const rowDragOverIndex = isOutOfBounds ? null : getHoveredRowIndex(api, updates[0]);

            ref.event = ev;
            ref.y = updates[0];
            if (rowDragOverIndex != null) {
              sx.internal.rowDragOverIndex.set(rowDragOverIndex);
              ref.overIndex = rowDragOverIndex;
              api.eventFire("onRowDragMove", ref);
            } else {
              sx.internal.rowDragOverIndex.set(-1);
              ref.overIndex = -1;
              api.eventFire("onRowDragMove", ref);
            }
          });
        },
        { signal: controller.signal },
      );

      window.addEventListener("dragend", (event) => {
        controller.abort();

        const overIndex = sx.internal.rowDragOverIndex.peek();
        ref.overIndex = overIndex;
        ref.event = event;

        const isValid = event.dataTransfer?.dropEffect !== "none";
        if (!isValid) api.eventFire("onRowDragCancel", ref);
        else api.eventFire("onRowDragEnd", ref);

        sx.internal.rowDragOverIndex.set(-1);
      });
    },
    placeholder: () => <DragPlaceholder row={row} />,
  });

  return draggable;
}
const DragPlaceholder = (p: { row: RowNode }) => {
  return (
    <div
      className={clsx(css`
        padding-inline: ${t.spacing.cell_horizontal_padding};
        padding-block: ${t.spacing.cell_vertical_padding};
        border: 1px solid ${t.colors.primary_50};
        background-color: ${t.colors.backgrounds_default};
        border-radius: ${t.spacing.box_radius_regular};
      `)}
    >
      Moving row {p.row.rowIndex}
    </div>
  );
};
