import { useCallback, useEffect, useState } from "react";
import type { RowCellLayout } from "../+types";
import { getTabbables, navigator } from "@1771technologies/lytenyte-shared";
import { useGridRoot } from "../context.js";
import { editOnChange } from "../state/helpers/edit-on-change.js";

interface CellEditorParams<T> {
  readonly cell: RowCellLayout<T>;
}
export function CellEditor<T>({ cell }: CellEditorParams<T>) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const grid = useGridRoot().grid;

  useEffect(() => {
    if (!el) return;

    const focusFirst = () => {
      const tabbables = getTabbables(el);
      if (!el.contains(document.activeElement)) tabbables.at(0)?.focus();
    };

    const controller = new AbortController();
    if (el.parentElement) {
      el.parentElement.addEventListener(
        "focus",
        () => {
          focusFirst();
        },
        { signal: controller.signal },
      );
    }

    focusFirst();

    return () => controller.abort();
  }, [el]);

  return (
    <div
      ref={setEl}
      style={{ width: "100%", height: "100%" }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          const parent = el?.parentElement;
          grid.api.editEnd(true);
          setTimeout(() => {
            parent?.focus();
          }, 4);
        }
        if (e.key === "Enter") {
          // Don't move if the there are validation errors.
          const editValidation = grid.internal.editValidation.get();
          if (
            typeof editValidation === "boolean"
              ? editValidation === false
              : Object.keys(editValidation).length >= 1
          ) {
            return;
          }

          const rtl = grid.state.rtl.get();
          const nav = navigator({
            viewport: grid.state.viewport.get()!,
            gridId: grid.state.gridId.get(),
            scrollIntoView: grid.api.scrollIntoView,
            getRootCell: grid.api.cellRoot,
            isRowDetailExpanded: (r) => {
              const row = grid.api.rowByIndex(r);
              if (!row) return false;
              return grid.api.rowDetailIsExpanded(row);
            },
            position: grid.internal.focusActive,
            columnCount: grid.state.columnMeta.get().columnsVisible.length,
            rowCount: grid.state.rowDataStore.rowCount.get(),

            downKey: "ArrowDown",
            upKey: "ArrowUp",
            nextKey: rtl ? "ArrowLeft" : "ArrowRight",
            prevKey: rtl ? "ArrowRight" : "ArrowLeft",
            endKey: "End",
            homeKey: "Home",
            pageDownKey: "PageDown",
            pageUpKey: "PageUp",
          });

          nav(
            {
              key: "ArrowDown",
              ctrlKey: false,
              metaKey: false,
              preventDefault: () => {},
              stopPropagation: () => {},
              shiftKey: false,
            },
            true,
          );
        }

        e.stopPropagation();
      }}
    >
      <EditRenderer cell={cell} />
    </div>
  );
}

function EditRenderer<T>({ cell }: CellEditorParams<T>) {
  const column = cell.column;
  const ctx = useGridRoot();

  const base = ctx.grid.state.columnBase.useValue();
  const editFuncs = ctx.grid.state.editRenderers.useValue();

  const editRenderer = column.editRenderer ?? base.editRenderer;

  const activeData = ctx.grid.internal.editData.useValue();

  const row = cell.row.get()!;

  const value = ctx.grid.api.columnField(
    column,
    row.kind === "branch"
      ? { kind: "branch", data: activeData, key: row.key }
      : { kind: "leaf", data: activeData },
  ) as any;

  const onChange = useCallback(
    (c: any) => {
      editOnChange({
        value: c,
        activeData,
        base,
        column,
        grid: ctx.grid,
        row,
        rowIndex: cell.rowIndex,
      });
    },
    [activeData, base, cell.rowIndex, column, ctx.grid, row],
  );

  if (!editRenderer) {
    const type = column.type;
    if (type === "number")
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => (e.target.value ? onChange(Number.parseFloat(e.target.value)) : 0)}
        />
      );
    if (type === "date")
      return <input type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    if (type === "datetime")
      return <input type="datetime-local" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;

    return <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }

  const Renderer = typeof editRenderer === "string" ? editFuncs[editRenderer] : editRenderer;

  const validation = ctx.grid.internal.editValidation.useValue();

  if (!Renderer) return null;

  return (
    <Renderer
      column={column}
      grid={ctx.grid}
      onChange={onChange}
      row={cell.row.get()!}
      rowIndex={cell.rowIndex}
      value={value}
      rowValidationState={validation}
    />
  );
}
