import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { CellRendererFn, RowCellLayout } from "../+types";
import { useGridRoot } from "../context";
import { getTranslate, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default";
import { CellEditor } from "./cell-editor";

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

  grid.internal.refreshKey.useValue();

  const viewport = cx.viewportWidthInner.useValue();
  const width = sizeFromCoord(cell.colIndex, xPositions, cell.colSpan);
  const height = sizeFromCoord(cell.rowIndex, yPositions, cell.rowSpan);

  const isSticky = !!cell.colPin;
  const isRowPinned = !!cell.rowPin;
  const rtl = cx.rtl.useValue();

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
      pointerEvents: "all",
    };
    if (isSticky) {
      styles.position = "sticky";

      if (rtl) styles.right = 0;
      else styles.left = 0;

      styles.zIndex = isRowPinned ? 5 : 2;
    }

    if (cell.colPin === "end") {
      const spaceLeft = xPositions.at(-1)! - xPositions[cell.colIndex];
      const x = viewport - spaceLeft;
      styles.transform = getTranslate(rtl ? -x : x, 0);
    } else {
      const x = xPositions[cell.colIndex];
      styles.transform = getTranslate(rtl ? -x : x, 0);
    }

    return { ...props.style, ...styles };
  }, [
    cell.colIndex,
    cell.colPin,
    height,
    isRowPinned,
    isSticky,
    props.style,
    rtl,
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

  const row = cell.row.useValue();

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

  if (!row) return null;
  return (
    <div
      {...props}
      ref={forwarded}
      style={styles}
      role="gridcell"
      /** Data attributes */
      data-ln-rowindex={cell.rowIndex}
      data-ln-colindex={cell.colIndex}
      data-ln-colspan={cell.colSpan}
      data-ln-rowspan={cell.rowSpan}
      data-ln-cell
      data-ln-last-top-pin={cell.rowLastPinTop}
      data-ln-first-bottom-pin={cell.rowFirstPinBottom}
      data-ln-last-start-pin={cell.colLastStartPin}
      data-ln-first-end-pin={cell.colFirstEndPin}
      /** Data attributes */
      tabIndex={isEditing ? -1 : 0}
    >
      {isEditing && <CellEditor cell={cell} />}
      {!isEditing && (
        <>
          {typeof Renderer === "function" ? (
            <Renderer
              column={cell.column}
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
    </div>
  );
});

export const Cell = fastDeepMemo(CellImpl);
