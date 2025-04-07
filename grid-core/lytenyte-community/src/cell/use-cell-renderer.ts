import { useMemo } from "react";
import { CellRendererDefault } from "./cell-renderer-default";
import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import { CellMarkerRenderer } from "../cell-marker/cell-marker-renderer";
import { CellGroupRendererDefault } from "../cell-group/cell-group";
import type {
  ApiCoreReact,
  CellRendererCoreReact,
  ColumnCoreReact,
} from "@1771technologies/grid-types/core-react";

export function useCellRenderer(
  api: ApiCoreReact<any>,
  column: ColumnCoreReact<any>,
): CellRendererCoreReact<any> {
  const renderers = api.getState().cellRenderers.peek();
  const Renderer = useMemo(() => {
    if (column.id === COLUMN_MARKER_ID) return CellMarkerRenderer;
    const base = api.getState().columnBase.peek();
    const renderKey = column.cellRenderer ?? base.cellRenderer;

    if (!renderKey)
      return api.columnIsGroupAutoColumn(column) ? CellGroupRendererDefault : CellRendererDefault;

    if (typeof renderKey === "string") {
      const El = renderers[renderKey];
      if (!El) throw new Error(`Renderer with name ${renderKey} is not present in grid renderers.`);
      return El;
    }
    return renderKey;
  }, [api, column, renderers]);

  return Renderer;
}
