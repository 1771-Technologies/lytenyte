import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import { HeaderCellMarker } from "./header-cell-marker";
import { HeaderCellDefault } from "./header-cell-default";

export function useHeaderCellRenderer(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
) {
  const sx = api.getState();
  const renderers = sx.columnHeaderRenderers.use();
  const base = sx.columnBase.use();

  const Renderer = useMemo(() => {
    if (column.id === COLUMN_MARKER_ID) return HeaderCellMarker;

    const fn = column.headerRenderer ?? base.headerRenderer;
    if (!fn) return HeaderCellDefault;

    if (typeof fn === "string") {
      const cell = renderers[fn];
      if (!cell) throw new Error(`Header cell renderer with name ${fn} does not exist.`);
      return cell;
    }

    return fn;
  }, [base.headerRenderer, column.headerRenderer, column.id, renderers]);

  return Renderer;
}
