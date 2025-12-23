import { forwardRef, memo, useMemo, type CSSProperties, type JSX } from "react";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import {
  COLUMN_MARKER_ID,
  sizeFromCoord,
  type LayoutHeaderCell,
  type LayoutHeaderFloating,
} from "@1771technologies/lytenyte-shared";
import { DefaultRenderer } from "./header-default.js";
import { useRoot } from "../../../root/root-context.js";
import { useDragMove } from "./use-drag-move.js";
import { ResizeHandler } from "./resize-handler.js";

const HeaderCellImpl = forwardRef<HTMLDivElement, HeaderCell.Props>(function HeaderCell(
  { cell, resizerClassName, resizerStyle, ...props },
  ref,
) {
  const { id, xPositions, base, view, api } = useRoot();

  const column = view.lookup.get(cell.id)!;
  const resizable = (column.resizable ?? base.resizable) && column.id !== COLUMN_MARKER_ID;

  const Renderer =
    cell.kind === "cell"
      ? ((column as any).headerRenderer ?? (base as any).headerRenderer ?? DefaultRenderer)
      : ((column as any).floatingCellRenderer ?? (base as any).floatingCellRenderer ?? DefaultRenderer);

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

  const { props: dragProps, placeholder } = useDragMove(cell, props.onDragStart);
  const headerStyle = useHeaderCellStyle(cell, xPositions);

  return (
    <div
      {...dragProps}
      {...props}
      onDragStart={dragProps.onDragStart}
      tabIndex={0}
      ref={ref}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-type={column.type ?? base.type ?? "string"}
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
        ...headerStyle,
        gridRowStart: 1,
        gridRowEnd: rowSpan + 1,
        width,
        height: "100%",
        boxSizing: "border-box",
        ...props.style,
      }}
    >
      {<Renderer column={column} api={api} />}
      {resizable && cell.kind === "cell" && (
        <ResizeHandler cell={cell} style={resizerStyle} className={resizerClassName} />
      )}
      {placeholder}
    </div>
  );
});

export const HeaderCell = memo(HeaderCellImpl);

export namespace HeaderCell {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly cell: LayoutHeaderCell | LayoutHeaderFloating;
    readonly resizerStyle?: CSSProperties;
    readonly resizerClassName?: string;
  };
}
