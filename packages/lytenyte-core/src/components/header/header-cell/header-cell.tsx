import { forwardRef, memo, useMemo, type CSSProperties, type JSX } from "react";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { type LayoutHeaderCell, type LayoutHeaderFloating } from "@1771technologies/lytenyte-shared";
import { useDragMove } from "./use-drag-move.js";
import { ResizeHandler } from "./resize-handler.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useCellRangeSelectionPieceContext } from "../../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useXCoordinates } from "../../../root/contexts/coordinates.js";
import { useAPI } from "../../../root/contexts/api-provider.js";
import { useColumnsContext } from "../../../root/contexts/columns/column-context.js";
import { useColumnSettingsContext } from "../../../root/contexts/columns/column-settings-context.js";
import { useGridEvents } from "../../../root/contexts/events-context.js";
import { useStyleContext } from "../../../root/contexts/styles-context.js";
import { rangesOverlap, sizeFromCoord } from "@1771technologies/js-utils";

const HeaderCellImpl = forwardRef<HTMLDivElement, HeaderCell.Props>(function HeaderCell(
  { cell, resizerClassName, resizerStyle, ...props },
  ref,
) {
  const id = useGridIdContext();
  const events = useGridEvents();
  const styles = useStyleContext();
  const api = useAPI();
  const { view } = useColumnsContext();

  const xPositions = useXCoordinates();

  const cellSelections$ = useCellRangeSelectionPieceContext();

  const column = view.lookup.get(cell.id)!;
  const settings = useColumnSettingsContext()[column.id];

  const Renderer = cell.kind === "cell" ? settings.headerRenderer : settings.floatingCellRenderer;

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

  const handlers = useMappedEvents(events.headerCell, { column, api, layout: cell });

  const { props: dragProps, placeholder } = useDragMove(cell, props.onDragStart ?? handlers.onDragStart);
  const headerStyle = useHeaderCellStyle(cell, xPositions);
  const cellSelected = cellSelections$.useValue((x) =>
    x.some((r) => rangesOverlap(r.columnStart, r.columnEnd, cell.colStart, cell.colEnd)),
  );

  return (
    <div
      className={styles?.header?.className}
      {...dragProps}
      {...handlers}
      {...props}
      onDragStart={dragProps.onDragStart}
      tabIndex={0}
      aria-colindex={cell.colStart + 1}
      aria-expanded={false}
      ref={ref}
      role="columnheader"
      // DATA Attributes Start
      data-ln-header-cell
      data-ln-type={settings.type}
      data-ln-header-floating={cell.kind === "floating" ? "true" : undefined}
      data-ln-colid={column.id}
      data-ln-gridid={id}
      data-ln-cell-selected={cellSelected}
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
        ...(props.style ?? styles?.header?.style),
      }}
    >
      {<Renderer column={column} api={api} />}
      {settings.resizable && cell.kind === "cell" && (
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
