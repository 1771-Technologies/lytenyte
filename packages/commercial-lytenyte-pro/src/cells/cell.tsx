import { forwardRef, memo, useEffect, useState, type JSX } from "react";
import type { RowCellLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default.js";
import { CellEditor } from "./cell-editor.js";
import { useRowMeta, type RowMetaData } from "../rows/row/context.js";
import { CellSpacePinStart, CellSpacerPinEnd } from "./cell-spacer.js";
import { useCellStyle } from "./use-cell-style.js";

export interface CellProps {
  readonly cell: RowCellLayout<any>;
}

export const Cell = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & CellProps
>(function Cell(props, forwarded) {
  const {
    colBounds: [start, end],
    ...rowMeta
  } = useRowMeta();
  // This enforces our column virtualization.
  if (
    props.cell.colPin == null &&
    (props.cell.colIndex >= end || props.cell.colIndex + props.cell.colSpan - 1 < start)
  ) {
    return null;
  }

  return <CellImpl {...props} ref={forwarded} {...rowMeta} />;
});

const CellImpl = memo(
  forwardRef<
    HTMLDivElement,
    Omit<JSX.IntrinsicElements["div"], "children"> & CellProps & Omit<RowMetaData, "colBounds">
  >(function Cell(
    {
      cell,
      row,
      selected,
      indeterminate,
      xPositions,
      yPositions,
      base,
      renderers,
      rtl,
      layout: _,
      ...props
    },
    forwarded,
  ) {
    const grid = useGridRoot().grid;

    const providedRenderer = cell.column.cellRenderer ?? base.cellRenderer;

    const Renderer = providedRenderer
      ? typeof providedRenderer === "string"
        ? (renderers[providedRenderer] ?? CellDefault)
        : providedRenderer
      : CellDefault;

    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
      return grid.internal.editActivePos.watch(() => {
        const pos = grid.internal.editActivePos.get();
        if (!pos) return setIsEditing(false);

        setIsEditing(
          pos.column === cell.column &&
            pos.rowIndex >= cell.rowIndex &&
            pos.rowIndex < cell.rowIndex + cell.rowSpan,
        );
      });
    }, [cell.column, cell.rowIndex, cell.rowSpan, grid.internal.editActivePos]);

    const style = useCellStyle(
      xPositions,
      yPositions,
      cell,
      rtl,
      grid.api.rowDetailRenderedHeight(row ?? ""),
      undefined,
    );

    if (cell.isDeadRow) return <div style={{ width: sizeFromCoord(cell.colIndex, xPositions) }} />;

    if (!row || cell.isDeadCol) return null;

    return (
      <>
        {cell.colFirstEndPin && <CellSpacerPinEnd xPositions={xPositions} />}

        <div
          {...props}
          ref={forwarded}
          role="gridcell"
          data-ln-rowindex={cell.rowIndex}
          data-ln-colindex={cell.colIndex}
          data-ln-colspan={cell.colSpan}
          data-ln-rowspan={cell.rowSpan}
          data-ln-pin={cell.colPin ?? "center"}
          data-ln-cell
          data-ln-last-top-pin={cell.rowLastPinTop}
          data-ln-first-bottom-pin={cell.rowFirstPinBottom}
          data-ln-last-start-pin={cell.colLastStartPin}
          data-ln-first-end-pin={cell.colFirstEndPin}
          tabIndex={isEditing ? -1 : 0}
          style={{ ...style, ...props.style }}
        >
          {isEditing && <CellEditor cell={cell} />}
          {!isEditing && (
            <Renderer
              column={cell.column}
              rowSelected={selected}
              rowIndeterminate={indeterminate}
              row={row}
              grid={grid}
              rowIndex={cell.rowIndex}
              colIndex={cell.colIndex}
              rowPin={cell.rowPin}
            />
          )}
        </div>
        {cell.colLastStartPin && <CellSpacePinStart xPositions={xPositions} />}
      </>
    );
  }),
);
