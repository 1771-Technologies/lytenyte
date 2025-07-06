import { useEffect, useState } from "react";
import type { RowCellLayout } from "../+types";
import { getTabbables } from "@1771technologies/lytenyte-dom-utils";
import { useGridRoot } from "../context";

interface CellEditorParams<T> {
  readonly cell: RowCellLayout<T>;
}
export function CellEditor<T>({ cell }: CellEditorParams<T>) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);

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
        if (e.key === "Tab") e.stopPropagation();
      }}
    >
      <EditRenderer cell={cell} />
    </div>
  );
}

function EditRenderer<T>({ cell }: CellEditorParams<T>) {
  const column = cell.column;
  const c = useGridRoot();
  const base = c.grid.state.columnBase.useValue();
  const editFuncs = c.grid.state.editRenderers.useValue();

  const editRenderer = column.editRenderer ?? base.editRenderer;

  if (!editRenderer) {
    const type = column.type;
    if (type === "number") return <input type="number" />;
    if (type === "date") return <input type="date" />;
    if (type === "datetime") return <input type="datetime-local" />;

    return <input />;
  }

  const Renderer = typeof editRenderer === "string" ? editFuncs[editRenderer] : editRenderer;

  if (!Renderer) return null;

  return (
    <Renderer
      column={column}
      grid={c.grid}
      onChange={() => {}}
      row={cell.row.get()!}
      rowIndex={cell.rowIndex}
      value={""}
      rowValidationState={{}}
    />
  );
}
