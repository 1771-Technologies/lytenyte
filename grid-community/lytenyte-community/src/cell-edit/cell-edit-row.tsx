import { CellEditorCell } from "./cell-editor-cell";
import { useEffect, useState } from "react";
import type { CellEditLocation } from "@1771technologies/grid-types/community";
import { useGrid } from "../use-grid";

export interface CellEditorProps {
  locations: CellEditLocation[];
}

export function CellEditorRow({ locations }: CellEditorProps) {
  const rowIndex = locations[0].rowIndex;
  const { state: s, api } = useGrid();

  const xPositions = s.columnPositions.use();
  const yPositions = s.internal.rowPositions.use();

  const active = s.internal.cellEditActiveLocation.use();

  const row = api.rowByIndex(rowIndex);

  const columns = s.columnsVisible.use();

  const [rowEl, setRowEl] = useState<HTMLDivElement | null>(null);

  const fullRow = s.cellEditFullRow.use();
  useEffect(() => {
    if (!rowEl || !fullRow) return;

    const controller = new AbortController();
    const signal = controller.signal;

    rowEl.addEventListener(
      "focusout",
      (ev) => {
        if (!api.cellEditIsActive()) return;
        if (!ev.relatedTarget || !rowEl.contains(ev.relatedTarget as HTMLElement)) {
          api.cellEditEndMany(locations);
        }
      },
      { signal },
    );

    return () => controller.abort();
  }, [api, fullRow, locations, rowEl]);

  if (!row) return null;

  return (
    <div
      ref={setRowEl}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
        height: 0px;
        z-index: 10;
      `}
    >
      {locations.map((l) => {
        const columnIndex = l.columnIndex;
        const column = columns[columnIndex];

        return (
          <CellEditorCell
            key={column.id}
            location={l}
            isActive={l.rowIndex === active?.rowIndex && l.columnIndex === active.columnIndex}
            column={column}
            row={row}
            xPositions={xPositions}
            yPositions={yPositions}
          />
        );
      })}
    </div>
  );
}
