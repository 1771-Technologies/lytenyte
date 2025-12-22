import { forwardRef, memo, type JSX } from "react";
import { sizeFromCoord, type LayoutCell } from "@1771technologies/lytenyte-shared";
import { CellDefault } from "./cell-default.js";
import { useCellStyle } from "./use-cell-style.js";
import { CellSpacerEnd } from "./cell-spacers/cell-spacer-end.js";
import { CellSpacerStart } from "./cell-spacers/cell-spacer-start.js";
import { useBounds, useFocus, useRoot } from "../../root/root-context.js";
import { $colEndBound, $colStartBound } from "../../selectors.js";
import { useRowMeta } from "../rows/row/context.js";
import type { Root } from "../../root/root.js";

export interface CellProps {
  readonly cell: LayoutCell<any>;
}

export const Cell = forwardRef<HTMLDivElement, Omit<JSX.IntrinsicElements["div"], "children"> & CellProps>(
  function Cell(props, forwarded) {
    const bounds = useBounds();
    const focus = useFocus();
    const end = bounds.useValue($colEndBound);
    const start = bounds.useValue($colStartBound);

    const isFocused = focus && focus.row === props.cell.rowIndex && focus.column === props.cell.colIndex;

    // This enforces our column virtualization.
    if (
      !isFocused &&
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
      editMode,
      dimensions: { innerWidth },
    } = useRoot();

    const rowMeta = useRowMeta();
    const row = rowMeta.row;

    const column = view.lookup.get(cell.id)! as Root.Column;

    const Renderer = column.cellRenderer ?? (base as Root.Column).cellRenderer ?? CellDefault;
    const EditRenderer = column.editRenderer ?? (base as Root.Column).editRenderer!;

    const isEditing = Boolean(editMode !== "readonly" && rowMeta.isEditing && EditRenderer);

    const editSetting = column.editable ?? (base as Root.Column).editable;
    const isEditable =
      row && typeof editSetting === "function"
        ? editSetting({ api, row, column, colIndex: cell.colIndex, rowIndex: cell.rowIndex })
        : (editSetting ?? false);

    const isEditingThis =
      isEditable &&
      ((editMode === "row" && isEditing) || (editMode === "cell" && rowMeta.editColumn === column.id));

    const willDisplayEdit = isEditing && isEditingThis;

    const style = useCellStyle(
      xPositions,
      yPositions,
      cell,
      rtl,
      row ? api.rowDetailHeight(row) : 0,
      undefined,
    );

    if (!row || cell.isDeadCol) return null;

    if (cell.isDeadRow) return <div style={{ width: sizeFromCoord(cell.colIndex, xPositions) }} />;

    const selected = row.__selected;
    const indeterminate = row.__indeterminate;

    return (
      <>
        {cell.colFirstEndPin && (
          <CellSpacerEnd viewportWidth={innerWidth} visibleEndCount={view.endCount} xPositions={xPositions} />
        )}

        <div
          {...props}
          ref={forwarded}
          role="gridcell"
          tabIndex={isEditingThis ? -1 : 0}
          style={{ ...style, ...props.style }}
          onBlur={
            !isEditing || editMode !== "cell"
              ? props.onBlur
              : (ev) => {
                  props.onBlur?.(ev);
                  // We are still in the same cell, no reason to end the editing.
                  if (ev.currentTarget !== ev.relatedTarget && ev.currentTarget.contains(ev.relatedTarget))
                    return;

                  rowMeta.commit();
                  return;
                }
          }
          // Data Properties
          data-ln-type={column.type ?? base.type ?? "string"}
          data-ln-rowindex={cell.rowIndex}
          data-ln-colindex={cell.colIndex}
          data-ln-colspan={cell.colSpan}
          data-ln-rowspan={cell.rowSpan}
          data-ln-colpin={cell.colPin ?? "center"}
          data-ln-rowpin={cell.rowPin ?? "center"}
          data-ln-gridid={id}
          data-ln-cell
          data-ln-edit-active={willDisplayEdit || undefined}
          data-ln-last-top-pin={cell.rowLastPinTop}
          data-ln-first-bottom-pin={cell.rowFirstPinBottom}
          data-ln-last-start-pin={cell.colLastStartPin}
          data-ln-first-end-pin={cell.colFirstEndPin}
        >
          {willDisplayEdit && (
            <EditRenderer
              api={api}
              cancel={rowMeta.cancel}
              commit={rowMeta.commit}
              changeData={rowMeta.changeData}
              changeValue={rowMeta.changeValue}
              rowIndex={cell.rowIndex}
              colIndex={cell.colIndex}
              column={column}
              row={row}
              editData={rowMeta.editData}
              editValue={api.columnField(column, { ...row, data: rowMeta.editData })}
            />
          )}
          {!willDisplayEdit && (
            <Renderer
              column={column}
              row={row}
              api={api}
              rowIndex={cell.rowIndex}
              colIndex={cell.colIndex}
              selected={selected}
              indeterminate={indeterminate}
            />
          )}
        </div>

        {cell.colLastStartPin && (
          <CellSpacerStart xPositions={xPositions} rowMeta={rowMeta} visibleStartCount={view.startCount} />
        )}
      </>
    );
  }),
);
