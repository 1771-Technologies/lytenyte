import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import { CellRendererDefault } from "../renderers/cell-renderer-default";

export function useCellRenderer(api: ApiCommunityReact<any>, column: ColumnCommunityReact<any>) {
  const renderers = api.getState().cellRenderers.peek();
  const Renderer = useMemo(() => {
    const base = api.getState().columnBase.peek();
    const renderKey = column.cellRenderer ?? base.cellRenderer;
    if (!renderKey) return CellRendererDefault;

    if (typeof renderKey === "string") {
      const El = renderers[renderKey];
      if (!El) throw new Error(`Renderer with name ${renderKey} is not present in grid renderers.`);
      return El;
    }
    return renderKey;
  }, [api, column.cellRenderer, renderers]);

  return Renderer;
}
