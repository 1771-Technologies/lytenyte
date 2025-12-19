import { forwardRef, memo, useMemo, type JSX } from "react";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { sizeFromCoord, type LayoutHeaderCell, type LayoutHeaderFloating } from "@1771technologies/lytenyte-shared";
import { DefaultRenderer } from "./header-default.js";
import { useRoot } from "../../../root/root-context.js";

export interface HeaderCellProps {
  readonly cell: LayoutHeaderCell | LayoutHeaderFloating;
}

const HeaderCellImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderCellProps>(function HeaderCell(
  { cell, children, ...props },
  ref,
) {
  const { id, xPositions, base, api } = useRoot();

  const column = api.columnById(cell.id)!;

  const Renderer =
    cell.kind === "cell"
      ? (column.headerRenderer ?? (base as any).headerRenderer ?? DefaultRenderer)
      : (column.floatingCellRenderer ?? (base as any).floatingCellRenderer ?? DefaultRenderer);

  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const rowSpan = cell.rowEnd - cell.rowStart;

  const dataAttrs = useMemo(() => {
    const dataAttrs: Record<string, boolean> = {};
    if (cell.kind !== "floating") {
      const start = column.groupPath?.length ?? 0;
      for (let i = start; i < start + rowSpan; i++) {
        dataAttrs[`data-ln-header-row-${i}`] = true;
      }
    }
    return dataAttrs;
  }, [column.groupPath?.length, cell.kind, rowSpan]);

  return (
    <div
      {...props}
      tabIndex={0}
      ref={ref}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-header-floating={cell.kind === "floating" ? "true" : undefined}
      data-ln-header-id={column.id}
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
      {children == undefined ? <Renderer column={column} api={api} /> : children}
    </div>
  );
});

export const HeaderCell = memo(HeaderCellImpl);
