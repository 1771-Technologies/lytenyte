import { forwardRef, memo, type JSX, type ReactNode } from "react";
import { useHeaderRowTemplate } from "./use-header-row-template.js";
import { useHeaderColTemplate } from "./use-header-col-template.js";
import { HeaderRowRenderer } from "./header-row/header-row-renderer.js";
import { useVirtualizedHeader } from "./use-virtualized-header.js";
import { useHeaderCellReactNodes } from "./use-header-cell-react-nodes.js";
import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { useBounds, useColumnLayout, useRoot } from "../../root/root-context.js";
import { $colEndBound, $colStartBound } from "../../selectors.js";

export interface HeaderProps {
  readonly children?: (cells: LayoutHeader[]) => ReactNode;
}

function HeaderImpl(
  { children = HeaderRowRenderer, ...props }: Omit<JSX.IntrinsicElements["div"], "children"> & HeaderProps,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { id, floatingRowEnabled, floatingRowHeight, headerGroupHeight, headerHeight, view, xPositions } = useRoot();
  const columnLayout = useColumnLayout();

  const bounds = useBounds();
  const colStartBound = bounds.useValue($colStartBound);
  const colEndBound = bounds.useValue($colEndBound);

  const gridRowTemplate = useHeaderRowTemplate(
    columnLayout.length,
    headerGroupHeight,
    headerHeight,
    floatingRowHeight,
    floatingRowEnabled,
  );
  const gridColTemplate = useHeaderColTemplate(view, xPositions);

  const virtualizedHeaderCells = useVirtualizedHeader(columnLayout, colStartBound, colEndBound);
  const headerRows = useHeaderCellReactNodes(virtualizedHeaderCells, children);

  return (
    <div
      {...props}
      ref={ref}
      role="rowgroup"
      data-ln-header
      data-ln-gridid={id}
      data-ln-rowcount={columnLayout.length - (floatingRowEnabled ? 1 : 0)}
      data-ln-floating={floatingRowEnabled ? true : undefined}
      style={{
        width: xPositions.at(-1)!,
        minWidth: "100%",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "grid",
        gridTemplateRows: gridRowTemplate,
        gridTemplateColumns: gridColTemplate,
        ...props.style,
      }}
    >
      {headerRows}
    </div>
  );
}

export const Header = memo(forwardRef(HeaderImpl));
