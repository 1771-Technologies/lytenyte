import { forwardRef, memo, useMemo, type CSSProperties, type JSX } from "react";
import { useHeaderCellStyle } from "./use-header-cell-style.js";
import { rangesOverlap, type LayoutHeaderGroup } from "@1771technologies/lytenyte-shared";
import { useRoot } from "../../../root/root-context.js";
import { useDragMove } from "./use-drag-move.js";
import { HeaderGroupDefault } from "./header-group-default.js";
import { useMappedEvents } from "../../../hooks/use-mapped-events.js";
import { useInternalShare } from "../../../internal.js";
import { ResizeHandler } from "./resize-handler.js";

const HeaderGroupCellImpl = forwardRef<HTMLDivElement, HeaderGroupCell.Props>(function HeaderCell(
  { cell, resizerClassName, resizerStyle, ...props },
  ref,
) {
  const {
    id,
    xPositions,
    api,
    view,
    headerGroupHeight,
    columnGroupDefaultExpansion,
    columnGroupExpansions,
    columnGroupRenderer,
    events,
    styles: sx,
  } = useRoot();

  const isExpanded = columnGroupExpansions[cell.id] ?? columnGroupDefaultExpansion;

  const x = xPositions[cell.colStart];
  const width = xPositions[cell.colEnd] - x;

  const styles = useHeaderCellStyle(cell, xPositions);

  const columns = useMemo(() => {
    return cell.columnIds.map((x) => view.lookup.get(x)!);
  }, [cell.columnIds, view.lookup]);

  const attrs = {
    [`data-ln-header-row-${cell.rowStart}`]: true,
  };

  const handlers = useMappedEvents(events.headerGroup, { layout: cell, columns, api });
  const { props: dragProps, placeholder } = useDragMove(cell, props.onDragStart ?? handlers.onDragStart);

  const { cellSelections } = useInternalShare();
  const isCellSelected = cellSelections.useValue((x) =>
    x.some((r) => rangesOverlap(r.columnStart, r.columnEnd, cell.colStart, cell.colEnd)),
  );

  const Renderer = columnGroupRenderer ?? HeaderGroupDefault;

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
      <Renderer
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
