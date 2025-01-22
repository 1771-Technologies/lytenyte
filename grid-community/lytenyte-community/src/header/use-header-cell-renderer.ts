import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo, type ReactNode } from "react";
import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import { HeaderCellMarker } from "./header-renderers/header-cell-marker";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";

export function useHeaderCellRenderer(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
  headerDefault: (p: ColumnHeaderRendererParamsReact<any>) => ReactNode,
) {
  const sx = api.getState();
  const renderers = sx.columnHeaderRenderers.use();
  const base = sx.columnBase.use();

  const Renderer = useMemo(() => {
    if (column.id === COLUMN_MARKER_ID) return HeaderCellMarker;

    const fn = column.headerRenderer ?? base.headerRenderer;
    if (!fn) return headerDefault;

    if (typeof fn === "string") {
      const cell = renderers[fn];
      if (!cell) throw new Error(`Header cell renderer with name ${fn} does not exist.`);
      return cell;
    }

    return fn;
  }, [base.headerRenderer, column.headerRenderer, column.id, headerDefault, renderers]);

  return Renderer;
}
