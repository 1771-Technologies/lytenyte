import { forwardRef, memo, useMemo, type CSSProperties, type JSX } from "react";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { type LayoutHeaderGroup } from "@1771technologies/lytenyte-shared";
import { useDragMove } from "./use-drag-move.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";
import { ResizeHandler } from "./resize-handler.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useCellRangeSelectionPieceContext } from "../../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useXCoordinates } from "../../../root/contexts/coordinates.js";
import { useAPI } from "../../../root/contexts/api-provider.js";
import { useColumnsContext } from "../../../root/contexts/columns/column-context.js";
import { useHeaderLayoutContext } from "../../../root/contexts/header-layout.js";
import { useGridRenderer } from "../../../root/contexts/grid-renderer-context.js";
import { useStyleContext } from "../../../root/contexts/styles-context.js";
import { useGridEvents } from "../../../root/contexts/events-context.js";
import { rangesOverlap } from "@1771technologies/js-utils";

const HeaderGroupCellImpl = forwardRef<HTMLDivElement, HeaderGroupCell.Props>(function HeaderCell(
  { cell, resizerClassName, resizerStyle, ...props },
  ref,
) {
  const id = useGridIdContext();
  const sx = useStyleContext();
  const events = useGridEvents();

  const api = useAPI();
  const { view, columnGroupExpansions, columnGroupExpansionsDefault } = useColumnsContext();
  const cellSelections$ = useCellRangeSelectionPieceContext();

  const xPositions = useXCoordinates();
  const { headerGroupHeight } = useHeaderLayoutContext();

  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions);

  const isExpanded = columnGroupExpansions[cell.id] ?? columnGroupExpansionsDefault;

  const columns = useMemo(() => {
    return cell.columnIds.map((x) => view.lookup.get(x)!);
  }, [cell.columnIds, view.lookup]);

  const attrs = {
    [`data-ln-header-row-${cell.rowStart}`]: true,
  };

  const handlers = useMappedEvents(events.headerGroup, { layout: cell, columns, api });
  const { props: dragProps, placeholder } = useDragMove(cell, props.onDragStart ?? handlers.onDragStart);

  const isCellSelected = cellSelections$.useValue((x) =>
    x.some((r) => rangesOverlap(r.columnStart, r.columnEnd, cell.colStart, cell.colEnd)),
  );

  const { ColumnGroupRenderer } = useGridRenderer();

  return (
    <div
      className={sx?.headerGroup?.className}
      {...dragProps}
      {...handlers}
      {...props}
      onDragStart={dragProps.onDragStart}
      aria-colindex={cell.colStart + 1}
      aria-expanded={isExpanded}
      tabIndex={0}
      ref={ref}
      role="columnheader"
      // Data attributes start
      data-ln-header-group
      data-ln-header-id={cell.id}
      data-ln-header-range={`${cell.colStart},${cell.colStart + cell.colSpan}`}
      data-ln-cell-selected={isCellSelected}
      data-ln-rowindex={cell.rowStart}
      data-ln-colindex={cell.colStart}
      data-ln-colspan={cell.colEnd - cell.colStart}
      data-ln-gridid={id}
      data-ln-colpin={cell.colPin ?? "center"}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      data-ln-collapsible={cell.isCollapsible}
      data-ln-collapsed={!isExpanded}
      {...attrs}
      // Data attributes end
      style={{
        ...styles,
        gridRow: "1 / 2",
        width,
        height: headerGroupHeight,
        boxSizing: "border-box",
        opacity: (cell.isHiddenMove ?? false) ? 0 : undefined,
        ...(props.style ?? sx?.headerGroup?.style),
      }}
    >
      <ColumnGroupRenderer
        api={api}
        columns={columns}
        groupPath={cell.groupPath}
        collapsed={!isExpanded}
        collapsible={cell.isCollapsible}
      />
      <ResizeHandler cell={cell} style={resizerStyle} className={resizerClassName} />
      {placeholder}
    </div>
  );
});

export const HeaderGroupCell = memo(HeaderGroupCellImpl);

export namespace HeaderGroupCell {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly cell: LayoutHeaderGroup;
    readonly resizerStyle?: CSSProperties;
    readonly resizerClassName?: string;
  };
}
