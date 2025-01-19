import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useMemo } from "react";
import { HeaderCellDefault } from "./header-renderers/header-cell-default";

export function useHeaderCellRenderer(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
) {
  const sx = api.getState();
  const renderers = sx.columnHeaderRenderers.use();
  const base = sx.columnBase.use();

  const Renderer = useMemo(() => {
    const fn = column.headerRenderer ?? base.headerRenderer;
    if (!fn) return HeaderCellDefault;

    if (typeof fn === "string") {
      const cell = renderers[fn];
      if (!cell) throw new Error(`Header cell renderer with name ${fn} does not exist.`);
      return cell;
    }

    return fn;
  }, [base.headerRenderer, column.headerRenderer, renderers]);

  return Renderer;
}
