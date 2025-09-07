import { useMemo } from "react";
import type { HeaderCellFloating, HeaderCellLayout, HeaderCellRendererParams } from "../+types";
import { useGridRoot } from "../context.js";

// eslint-disable-next-line react-refresh/only-export-components
function DefaultRenderer(p: HeaderCellRendererParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}

export function useHeaderCellRenderer<T>(cell: HeaderCellLayout<T> | HeaderCellFloating<T>) {
  const ctx = useGridRoot().grid;

  const base = ctx.state.columnBase.useValue();

  const floatingRenderers = ctx.state.floatingCellRenderers.useValue();
  const headerRenderers = ctx.state.headerCellRenderers.useValue();

  return useMemo(() => {
    if (cell.kind === "cell") {
      const renderer = cell.column.headerRenderer ?? base.headerRenderer ?? DefaultRenderer;
      if (typeof renderer === "string") return headerRenderers[renderer] ?? DefaultRenderer;
      else return renderer;
    } else {
      const renderer =
        cell.column.floatingCellRenderer ?? base.floatingCellRenderer ?? DefaultRenderer;
      if (typeof renderer === "string") return floatingRenderers[renderer] ?? DefaultRenderer;
      else return renderer;
    }
  }, [
    base.floatingCellRenderer,
    base.headerRenderer,
    cell.column.floatingCellRenderer,
    cell.column.headerRenderer,
    cell.kind,
    floatingRenderers,
    headerRenderers,
  ]);
}
