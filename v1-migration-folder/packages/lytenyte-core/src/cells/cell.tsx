import { forwardRef, useEffect, useState, type JSX, type ReactNode } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { CellRendererFn, RowCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { CellReact } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default";
import { CellEditor } from "./cell-editor";
import { useRowMeta } from "../rows/row/context";

export interface CellProps {
  readonly cell: RowCellLayout<any>;
  readonly children?: ReactNode | CellRendererFn<any>;
}

const CellImpl = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & CellProps
>(function Cell({ cell, children, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const cx = grid.state;

  grid.internal.refreshKey.useValue();

  const row = cell.row.useValue();

  const renderers = cx.cellRenderers.useValue();
  const providedRenderer = children ?? cell.column.cellRenderer;

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

  const rowMeta = useRowMeta();
  if (!row) return null;

  return (
    <CellReact
      {...props}
      ref={forwarded}
      cell={cell}
      isEditing={isEditing}
      viewportWidth={cx.viewportWidthInner.useValue()}
      detailHeight={grid.api.rowDetailRenderedHeight(row ?? "")}
      rtl={cx.rtl.useValue()}
      xPosition={cx.xPositions.useValue()}
      yPosition={cx.yPositions.useValue()}
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
            />
          ) : (
            Renderer
          )}
        </>
      )}
    </CellReact>
  );
});

export const Cell = fastDeepMemo(CellImpl);
