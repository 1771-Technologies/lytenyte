import { forwardRef, memo, useCallback, useMemo, type JSX } from "react";
import { type LayoutCell } from "@1771technologies/lytenyte-shared";
import { useCellStyle } from "./use-cell-style.js";
import { useRoot } from "../../root/root-context.js";
import { useRowMeta } from "../rows/row/context.js";
import type { Root } from "../../root/root.js";
import { useMappedEvents } from "../../hooks/use-mapped-events.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useColumnSettingsContext } from "../../root/contexts/columns/column-settings-context.js";
import { useStartBoundsContext } from "../../root/contexts/bounds.js";
import { useFocusNonReactive } from "../../root/contexts/focus-position.js";
import { useXCoordinates, useYCoordinates } from "../../root/contexts/coordinates.js";

export const Cell = forwardRef<HTMLDivElement, Cell.Props>(function Cell(props, forwarded) {
  const [start, end] = useStartBoundsContext();
  const focus = useFocusNonReactive().get();

  const isFocused =
    focus?.kind === "cell" &&
    focus.rowIndex === props.cell.rowIndex &&
    focus.colIndex === props.cell.colIndex;

  // This enforces our column virtualization.
  if (
    !isFocused &&
    props.cell.colPin == null &&
    (props.cell.colIndex >= end || props.cell.colIndex + props.cell.colSpan - 1 < start)
  ) {
    return null;
  }

  return <CellImpl {...props} ref={forwarded} />;
});

const CellImpl = memo(
  forwardRef<HTMLDivElement, Cell.Props>(function Cell({ cell, ...props }, forwarded) {
    const id = useGridIdContext();
    const { api, view, editMode, events, styles } = useRoot();
    const settings = useColumnSettingsContext()[cell.id];
    const rowMeta = useRowMeta();
    const row = rowMeta.row;

    const yPositions = useYCoordinates();
    const xPositions = useXCoordinates();

    const column = view.lookup.get(cell.id)! as Root.Column;
    const Renderer = settings.cellRenderer;
    const EditRenderer = settings.editRenderer!;
    const editSetting = settings.editable;

    const { willDisplayEdit, isEditingThis } = useMemo(() => {
      const isEditing = Boolean(editMode !== "readonly" && rowMeta.isEditing && EditRenderer);
      const isEditable =
        row && typeof editSetting === "function"
          ? editSetting({ api, row, column, rowIndex: cell.rowIndex, colIndex: cell.colIndex })
          : editSetting;

      const isEditingThis =
        isEditable &&
        ((editMode === "row" && isEditing) || (editMode === "cell" && rowMeta.editColumn === column.id));

      const willDisplayEdit = isEditing && isEditingThis;
      return { isEditingThis, willDisplayEdit };
    }, [
      EditRenderer,
      api,
      cell.colIndex,
      cell.rowIndex,
      column,
      editMode,
      editSetting,
      row,
      rowMeta.editColumn,
      rowMeta.isEditing,
    ]);
    const changeValue = useCallback(
      (value: unknown) => {
        return rowMeta.changeValue(value, column);
      },
      [column, rowMeta],
    );

    const style = useCellStyle(xPositions, yPositions, cell, rowMeta.detailHeight);
    const handlers = useMappedEvents(events.cell, { column, row, api, layout: cell });

    if (!row || cell.isDeadCol || cell.isDeadRow) return null;

    const selected = row.__selected;
    const indeterminate = row.__indeterminate;

    const handleFocus = willDisplayEdit && !!EditRenderer;
    return (
      <div
        className={styles?.cell?.className}
        {...handlers}
        {...props}
        ref={forwarded}
        role="gridcell"
        aria-colindex={cell.colIndex + 1}
        tabIndex={isEditingThis ? -1 : 0}
        onFocus={
          handleFocus
            ? (e) => {
                (props.onFocus ?? handlers.onFocus)?.(e);
                if (e.isPropagationStopped()) return;

                rowMeta.setActiveEdit((prev) => {
                  if (!prev) return prev;

                  return { ...prev, column: column.id };
                });
              }
            : (props.onFocus ?? handlers.onFocus)
        }
        style={{ ...style, ...(props.style ?? styles?.cell?.style) }}
        // Data Properties
        data-ln-type={settings.type}
        data-ln-rowindex={cell.rowIndex}
        data-ln-colindex={cell.colIndex}
        data-ln-colspan={cell.colSpan}
        data-ln-rowspan={cell.rowSpan}
        data-ln-colpin={cell.colPin ?? "center"}
        data-ln-rowpin={cell.rowPin ?? "center"}
        data-ln-colid={cell.id}
        data-ln-gridid={id}
        data-ln-cell
        data-ln-edit-active={willDisplayEdit || undefined}
        data-ln-edit-valid={rowMeta.editValidation == null ? undefined : rowMeta.editValidation === true}
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
            changeValue={changeValue}
            rowIndex={cell.rowIndex}
            colIndex={cell.colIndex}
            column={column}
            row={row}
            layout={cell}
            editData={rowMeta.editData}
            editValidation={rowMeta.editValidation!}
            editValue={api.columnField(column, { ...row, data: rowMeta.editData })}
          />
        )}
        {!willDisplayEdit && (
          <Renderer
            column={column}
            editData={rowMeta.editData}
            row={row}
            api={api}
            layout={cell}
            rowIndex={cell.rowIndex}
            colIndex={cell.colIndex}
            selected={selected}
            indeterminate={indeterminate}
            detailExpanded={rowMeta.detailExpanded}
          />
        )}
      </div>
    );
  }),
);

export namespace Cell {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly cell: LayoutCell;
  };
}
