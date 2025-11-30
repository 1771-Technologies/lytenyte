import { forwardRef, memo, useMemo, type JSX, type ReactNode } from "react";
import { useGridRoot } from "../root/context-grid.js";
import { useHeaderRowTemplate } from "./use-header-row-template.js";
import { useHeaderColTemplate } from "./use-header-col-template.js";
import { HeaderRowContext } from "../header-row/context.js";
import { HeaderRowRenderer } from "../header-row/header-row-renderer.js";
import type { HeaderLayoutCell } from "../types/layout.js";
import { useColumnLayout } from "../root/column-layout/column-layout-context.js";

export interface HeaderProps<T = any> {
  readonly children?: (cells: HeaderLayoutCell<T>[]) => ReactNode;
}

function HeaderImpl(
  {
    children = HeaderRowRenderer,
    ...props
  }: Omit<JSX.IntrinsicElements["div"], "children"> & HeaderProps<any>,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const {
    id,
    headerRowCount,
    floatingRowEnabled,
    floatingRowHeight,
    headerGroupHeight,
    headerHeight,
    columnMeta,
    xPositions,
  } = useGridRoot();

  const gridRowTemplate = useHeaderRowTemplate(
    headerRowCount,
    headerGroupHeight,
    headerHeight,
    floatingRowHeight,
    floatingRowEnabled,
  );
  const gridColTemplate = useHeaderColTemplate(columnMeta, xPositions);
  const layout = useColumnLayout();

  const headerRows = useMemo(() => {
    const rows: ReactNode[] = [];

    for (let i = 0; i < headerRowCount; i++) {
      const rowCells = layout[i];
      rows.push(
        <HeaderRowContext key={i} value={i}>
          {children(rowCells)}
        </HeaderRowContext>,
      );
    }

    return rows;
  }, [children, headerRowCount, layout]);

  return (
    <div
      {...props}
      ref={ref}
      role="rowgroup"
      data-ln-header
      data-ln-gridid={id}
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
