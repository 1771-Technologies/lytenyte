import { useCallback, useEffect, useState } from "react";
import type { RowCellLayout } from "../+types";
import { getTabbables } from "@1771technologies/lytenyte-dom-utils";
import { useGridRoot } from "../context";
import { editOnChange } from "../state/helpers/edit-on-change";
import { handleNavigationKeys } from "@1771technologies/lytenyte-shared";

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
          const ds = grid.state.rowDataStore;

          handleNavigationKeys(
            {
              ctrlKey: false,
              metaKey: false,
              key: "ArrowDown",
              preventDefault: () => {},
              stopPropagation: () => {},
            },
            {
              vp: grid.state.viewport.get(),
              rowCount: ds.rowCount.get(),
              topCount: ds.rowTopCount.get(),
              centerCount: ds.rowCenterCount.get(),
              columnCount: grid.state.columnMeta.get().columnsVisible.length,
              focusActive: grid.internal.focusActive,
              id: grid.state.gridId.get(),
              layout: grid.internal.layout.get(),
              rtl: grid.state.rtl.get(),
              scrollIntoView: grid.api.scrollIntoView,
            },
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
      ? { kind: "branch", data: activeData }
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
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        />
      );
    if (type === "date")
      return <input type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
    if (type === "datetime")
      return (
        <input type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} />
      );

    return <input value={value} onChange={(e) => onChange(e.target.value)} />;
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
