import { forwardRef, memo, type JSX, type ReactNode } from "react";
import { useGridRoot } from "../root/context.js";
import { useHeaderRowTemplate } from "./use-header-row-template.js";
import { useHeaderColTemplate } from "./use-header-col-template.js";
import { HeaderRowRenderer } from "./header-row/header-row-renderer.js";
import type { HeaderLayoutCell } from "../layout.js";
import { useColumnLayout } from "../root/layout-columns/column-layout-context.js";
import { useBounds } from "../root/bounds/context.js";
import { $colEndBound, $colStartBound } from "../selectors/selectors.js";
import { useVirtualizedHeader } from "./use-virtualized-header.js";
import { useHeaderCellReactNodes } from "./use-header-cell-react-nodes.js";

export interface HeaderProps<T = any> {
  readonly children?: (cells: HeaderLayoutCell<T>[]) => ReactNode;
}

function HeaderImpl(
  { children = HeaderRowRenderer, ...props }: Omit<JSX.IntrinsicElements["div"], "children"> & HeaderProps<any>,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const boundsPiece = useBounds();
  const colStartBound = boundsPiece.useValue($colStartBound);
  const colEndBound = boundsPiece.useValue($colEndBound);
  const layout = useColumnLayout();

  const { id, floatingRowEnabled, floatingRowHeight, headerGroupHeight, headerHeight, columnMeta, xPositions } =
    useGridRoot();

  const gridRowTemplate = useHeaderRowTemplate(
    layout.length,
    headerGroupHeight,
    headerHeight,
    floatingRowHeight,
    floatingRowEnabled,
  );
  const gridColTemplate = useHeaderColTemplate(columnMeta, xPositions);

  const virtualizedHeaderCells = useVirtualizedHeader(layout, colStartBound, colEndBound);
  const headerRows = useHeaderCellReactNodes(virtualizedHeaderCells, children);

  return (
    <div
      {...props}
      ref={ref}
      role="rowgroup"
      data-ln-header
      data-ln-gridid={id}
      data-ln-rowcount={layout.length - (floatingRowEnabled ? 1 : 0)}
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
