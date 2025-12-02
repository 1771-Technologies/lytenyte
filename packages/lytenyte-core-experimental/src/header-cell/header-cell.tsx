import { forwardRef, memo, useMemo, type JSX } from "react";
import { useGridRoot } from "../root/context-grid.js";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { DefaultRenderer } from "./header-default.js";
import type { HeaderCellFloating, HeaderCellLayout } from "../types/layout.js";

export interface HeaderCellProps<T> {
  readonly cell: HeaderCellLayout<T> | HeaderCellFloating<T>;
}

const HeaderCellImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & HeaderCellProps<any>
>(function HeaderCell({ cell, children, ...props }, ref) {
  const { id, xPositions, columnBase: base } = useGridRoot();

  const Renderer =
    cell.kind === "cell"
      ? (cell.column.headerRenderer ?? base.headerRenderer ?? DefaultRenderer)
      : (cell.column.floatingCellRenderer ?? base.floatingCellRenderer ?? DefaultRenderer);

  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const rowSpan = cell.rowEnd - cell.rowStart;

  const dataAttrs = useMemo(() => {
    const dataAttrs: Record<string, boolean> = {};
    if (cell.kind !== "floating") {
      const start = cell.column.groupPath?.length ?? 0;
      for (let i = start; i < start + rowSpan; i++) {
        dataAttrs[`data-ln-header-row-${i}`] = true;
      }
    }
    return dataAttrs;
  }, [cell.column.groupPath?.length, cell.kind, rowSpan]);

  return (
    <div
      {...props}
      tabIndex={0}
      ref={ref}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-header-floating={cell.kind === "floating" ? "true" : undefined}
      data-ln-header-id={cell.column.id}
      data-ln-gridid={id}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-colpin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      {...dataAttrs}
      // Data attributes end
      style={{
        ...useHeaderCellStyle(cell, xPositions),
        gridRowStart: 1,
        gridRowEnd: rowSpan + 1,
        width,
        height: "100%",
        boxSizing: "border-box",
        ...props.style,
      }}
    >
      {children == undefined ? <Renderer column={cell.column} /> : children}
    </div>
  );
});

export const HeaderCell = memo(HeaderCellImpl);
