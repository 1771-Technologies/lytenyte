import { sizeFromCoord } from "@1771technologies/js-utils";
import { CellEditorCell } from "./cell-editor-cell";
import { useEffect, useState } from "react";
import type { CellEditLocation } from "@1771technologies/grid-types/community";
import { useGrid } from "../use-grid";

export interface CellEditorProps {
  locations: CellEditLocation[];
  getY: (i: number) => number;
}

export function CellEditorRow({ getY, locations }: CellEditorProps) {
  const rowIndex = locations[0].rowIndex;
  const { state: s, api } = useGrid();

  const xPositions = s.columnPositions.use();
  const yPositions = s.internal.rowPositions.use();

  const height = sizeFromCoord(rowIndex, yPositions);
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
      style={{
        position: "absolute",
        width: "100%",
        height: 0,
        top: getY(rowIndex),
        zIndex: 10,
      }}
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
            height={height}
            xPositions={xPositions}
          />
        );
      })}
    </div>
  );
}
