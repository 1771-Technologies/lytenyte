import "./row-container.css";

import type { PropsWithChildren } from "react";
import { useDroppable } from "@1771technologies/react-dragon";
import { useGrid } from "../use-grid";
import type { RowNodeCore } from "@1771technologies/grid-types/core";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";

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

      const data = p.getData() as { rows: RowNodeCore<any>[]; api: ApiCoreReact<any> };

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

  const columns = state.columnsVisible.use();

  if (columns.length === 0) return <></>;

  return (
    <div
      style={{ width: totalWidth, minHeight: totalHeight }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="lng1771-row-container"
    >
      {children}
    </div>
  );
}
