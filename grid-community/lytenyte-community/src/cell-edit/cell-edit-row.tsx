import { CellEditorCell } from "./cell-editor-cell";
import type { CellEditLocation } from "@1771technologies/grid-types/core";
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

  if (!row) return null;

  return (
    <>
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
    </>
  );
}
