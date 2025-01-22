import type { PropsWithChildren } from "react";
import { t } from "@1771technologies/grid-design";
import { useDroppable } from "@1771technologies/react-dragon";
import { useGrid } from "../../use-grid";
import type { RowNode } from "@1771technologies/grid-types/community";
import type { ApiCommunityReact } from "@1771technologies/grid-types";

export function RowContainer({
  totalHeight,
  totalWidth,
  children,
}: PropsWithChildren<{ totalWidth: number; totalHeight: number | undefined }>) {
  const { api, state } = useGrid();
  const gridId = state.gridId.use();
  const { onDragOver, onDrop } = useDroppable({
    tags: [`${gridId}:row-drag`],
    onDrop: (p) => {
      const overIndex = state.internal.rowDragOverIndex.peek();

      const data = p.getData() as { rows: RowNode[]; api: ApiCommunityReact<any> };

      if (!data?.rows || !data?.api) return;

      const isExternal = data.api !== api;
      const additional = isExternal ? { externalGridApi: data.api, isExternal: true } : {};

      api.eventFire("onRowDragDrop", {
        api,
        event: p.event,
        overIndex,
        rows: data.rows,
        ...additional,
      });
    },
  });

  return (
    <div
      style={{ width: totalWidth, minHeight: totalHeight }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={css`
        background-color: ${t.colors.backgrounds_row};
        display: flex;
        flex-direction: column;

        & > div {
          display: grid;
          grid-template-rows: 0px;
          grid-template-columns: 0px;
        }
      `}
    >
      {children}
    </div>
  );
}
