import { getHoveredRowIndex } from "@1771technologies/grid-core";
import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type {
  ApiCoreReact,
  RowDragEventParamsCoreReact,
} from "@1771technologies/grid-types/core-react";
import { getClientX, getClientY, getRelativeXPosition } from "@1771technologies/js-utils";
import { useDraggable } from "@1771technologies/react-dragon";

export function useDragControl(api: ApiCoreReact<any>, row: RowNodeCore<any>) {
  const draggable = useDraggable({
    dragData: () => {
      const sx = api.getState();

      const rows = sx.rowDragMultiRow.peek()
        ? [row, ...api.rowSelectionGetSelected().filter((r) => r !== row)]
        : [row];

      return { rows, api };
    },
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

      sx.internal.rowDragStartIndex.set(row.rowIndex!);

      const rows = sx.rowDragMultiRow.peek()
        ? [row, ...api.rowSelectionGetSelected().filter((r) => r !== row)]
        : [row];
      const ref: RowDragEventParamsCoreReact<any> = {
        event: ev.event,
        api,
        rows,
        overIndex: -1,
      };

      api.eventFire("onRowDragStart", ref);

      const externalGrids = sx.rowDragExternalGrids.peek();
      const apis = [api, ...externalGrids];

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
            for (let i = 0; i < apis.length; i++) {
              const api = apis[i];
              const sx = api.getState();

              const viewport = sx.internal.viewport.peek();
              if (!viewport) continue;

              const relative = getRelativeXPosition(viewport, clientX);
              const isOutOfBounds = relative.left < 0 || relative.right < 0;

              const rowDragOverIndex = isOutOfBounds ? null : getHoveredRowIndex(api, updates[0]);

              ref.event = ev;
              if (rowDragOverIndex != null) {
                sx.internal.rowDragOverIndex.set(rowDragOverIndex);
                ref.overIndex = rowDragOverIndex;
                api.eventFire("onRowDragMove", ref);
              } else {
                sx.internal.rowDragOverIndex.set(-1);
                ref.overIndex = -1;
                api.eventFire("onRowDragMove", ref);
              }
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

        for (const api of apis) {
          const sx = api.getState();
          sx.internal.rowDragOverIndex.set(-1);
          sx.internal.rowDragStartIndex.set(-1);
        }
      });
    },
    placeholder: () => {
      const sx = api.getState();
      const rows = sx.rowDragMultiRow.peek()
        ? [row, ...api.rowSelectionGetSelected().filter((r) => r !== row)]
        : [row];
      return <DragPlaceholder rows={rows} />;
    },
  });

  return draggable;
}

const DragPlaceholder = (p: { rows: RowNodeCore<any>[] }) => {
  const label =
    p.rows.length === 1 ? `Moving row ${p.rows[0].rowIndex}` : `Moving ${p.rows.length} rows`;
  return <div className="lng1771-drag-placeholder">{label}</div>;
};
