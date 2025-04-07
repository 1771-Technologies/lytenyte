import { useMemo } from "react";
import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import { HeaderCellDefault } from "./header-cell-default";
import { HeaderCellMarker } from "../../header-marker/header-cell-marker";
import type {
  ApiCoreReact,
  ColumnCoreReact,
  ColumnHeaderRendererCoreReact,
} from "@1771technologies/grid-types/core-react";

export function useHeaderCellRenderer(
  api: ApiCoreReact<any>,
  column: ColumnCoreReact<any>,
): ColumnHeaderRendererCoreReact<any> {
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
