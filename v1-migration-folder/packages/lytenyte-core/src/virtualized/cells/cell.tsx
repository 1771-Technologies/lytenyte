import { forwardRef, useMemo, type CSSProperties, type JSX, type ReactNode } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { CellRendererFn, RowCellLayout } from "../../+types";
import { useGridRoot } from "../context";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default";

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
  const xPositions = cx.xPositions.useValue();
  const yPositions = cx.yPositions.useValue();

  const viewport = cx.viewportWidthInner.useValue();
  const width = sizeFromCoord(cell.colIndex, xPositions, cell.colSpan);
  const height = sizeFromCoord(cell.rowIndex, yPositions, cell.rowSpan);

  const isSticky = !!cell.colPin;
  const isRowPinned = !!cell.rowPin;

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      height,
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: "border-box",
      gridColumnStart: "1",
      gridColumnEnd: "2",
      gridRowStart: "1",
      gridRowEnd: "2",
    };
    if (isSticky) {
      styles.position = "sticky";
      styles.left = 0;

      styles.zIndex = isRowPinned ? 5 : 2;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colIndex];
      styles.transform = getTranslate(viewport - spaceLeft, 0);
    } else {
      styles.transform = getTranslate(xPositions[cell.colIndex], 0);
    }

    return { ...props.style, ...styles };
  }, [
    cell.colIndex,
    cell.colPin,
    height,
    isRowPinned,
    isSticky,
    props.style,
    viewport,
    width,
    xPositions,
  ]);

  const renderers = cx.cellRenderers.useValue();
  const providedRenderer = children ?? cell.column.cellRenderer;

  const Renderer = providedRenderer
    ? typeof providedRenderer === "string"
      ? (renderers[providedRenderer] ?? CellDefault)
      : providedRenderer
    : CellDefault;

  const r = cx.rowDataStore.rowForIndex(cell.rowIndex);
  const row = r.useValue();

  if (!row) return null;

  return (
    <div {...props} ref={forwarded} style={styles}>
      {typeof Renderer === "function" ? (
        <Renderer column={cell.column} row={row} grid={grid} />
      ) : (
        Renderer
      )}
    </div>
  );
});

export const Cell = fastDeepMemo(CellImpl);
