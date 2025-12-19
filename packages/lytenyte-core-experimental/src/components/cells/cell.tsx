import { forwardRef, memo, type JSX } from "react";
import { sizeFromCoord, type LayoutCell } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default.js";
import { useCellStyle } from "./use-cell-style.js";
import { CellSpacerEnd } from "./cell-spacers/cell-spacer-end.js";
import { CellSpacerStart } from "./cell-spacers/cell-spacer-start.js";
import { useBounds, useRoot } from "../../root/root-context.js";
import { $colEndBound, $colStartBound } from "../../selectors.js";
import { useRowMeta } from "../rows/row/context.js";

export interface CellProps {
  readonly cell: LayoutCell<any>;
}

export const Cell = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "children"> & CellProps>(
  function Cell(props, forwarded) {
    const bounds = useBounds();
    const end = bounds.useValue($colEndBound);
    const start = bounds.useValue($colStartBound);

    // This enforces our column virtualization.
    if (
      props.cell.colPin == null &&
      (props.cell.colIndex >= end || props.cell.colIndex + props.cell.colSpan - 1 < start)
    ) {
      return null;
    }

    return <CellImpl {...props} ref={forwarded} />;
  },
);

const CellImpl = memo(
  forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "children"> & CellProps>(function Cell(
    { cell, ...props },
    forwarded,
  ) {
    const {
      id,
      rtl,
      base,
      xPositions,
      yPositions,
      api,
      view,
      dimensions: { innerWidth },
    } = useRoot();

    const rowMeta = useRowMeta();
    const row = rowMeta.row;

    const column = api.columnById(cell.id)!;

    const Renderer = column.cellRenderer ?? (base as any).cellRenderer ?? CellDefault;

    // TODO
    const isEditing = false;

    const style = useCellStyle(xPositions, yPositions, cell, rtl, row ? api.rowDetailHeight(row) : 0, undefined);

    if (cell.isDeadRow) return <div style={{ width: sizeFromCoord(cell.colIndex, xPositions) }} />;

    if (!row || cell.isDeadCol) return null;

    return (
      <>
        {cell.colFirstEndPin && (
          <CellSpacerEnd viewportWidth={innerWidth} visibleEndCount={view.endCount} xPositions={xPositions} />
        )}

        <div
          {...props}
          ref={forwarded}
          role="gridcell"
          tabIndex={isEditing ? -1 : 0}
          style={{ ...style, ...props.style }}
          // Data Properties
          data-ln-rowindex={cell.rowIndex}
          data-ln-colindex={cell.colIndex}
          data-ln-colspan={cell.colSpan}
          data-ln-rowspan={cell.rowSpan}
          data-ln-colpin={cell.colPin ?? "center"}
          data-ln-rowpin={cell.rowPin ?? "center"}
          data-ln-gridid={id}
          data-ln-cell
          data-ln-last-top-pin={cell.rowLastPinTop}
          data-ln-first-bottom-pin={cell.rowFirstPinBottom}
          data-ln-last-start-pin={cell.colLastStartPin}
          data-ln-first-end-pin={cell.colFirstEndPin}
        >
          {/* {isEditing && <CellEditor cell={cell} />} */}
          {!isEditing && <Renderer column={column} row={row} api={api} />}
        </div>

        {cell.colLastStartPin && (
          <CellSpacerStart xPositions={xPositions} rowMeta={rowMeta} visibleStartCount={view.startCount} />
        )}
      </>
    );
  }),
);
