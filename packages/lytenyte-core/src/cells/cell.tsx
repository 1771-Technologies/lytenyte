import { forwardRef, useEffect, useState, type JSX } from "react";
import type { RowCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { CellReact, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default";
import { CellEditor } from "./cell-editor";
import { useRowMeta } from "../rows/row/context";
import { CellSpacePinStart, CellSpacerPinEnd } from "./cell-spacer";

export interface CellProps {
  readonly cell: RowCellLayout<any>;
}

export const Cell = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & CellProps
>(function Cell({ cell, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const cx = grid.state;

  const base = grid.state.columnBase.useValue();

  const row = cell.row.useValue();

  const renderers = cx.cellRenderers.useValue();
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

  const xPositions = cx.xPositions.useValue();
  const yPositions = cx.yPositions.useValue();

  const rowMeta = useRowMeta();
  if (cell.isDeadRow) return <div style={{ width: sizeFromCoord(cell.colIndex, xPositions) }} />;

  if (!row || cell.isDeadCol) return null;

  return (
    <>
      {cell.colFirstEndPin && <CellSpacerPinEnd />}
      <CellReact
        {...props}
        ref={forwarded}
        cell={cell}
        isEditing={isEditing}
        detailHeight={grid.api.rowDetailRenderedHeight(row ?? "")}
        rtl={cx.rtl.useValue()}
        xPosition={xPositions}
        yPosition={yPositions}
      >
        {isEditing && <CellEditor cell={cell} />}
        {!isEditing && (
          <>
            {typeof Renderer === "function" ? (
              <Renderer
                column={cell.column}
                rowSelected={rowMeta.selected}
                rowIndeterminate={rowMeta.indeterminate}
                row={row}
                grid={grid}
                rowIndex={cell.rowIndex}
                colIndex={cell.colIndex}
                rowPin={cell.rowPin}
              />
            ) : (
              Renderer
            )}
          </>
        )}
      </CellReact>
      {cell.colLastStartPin && <CellSpacePinStart />}
    </>
  );
});
