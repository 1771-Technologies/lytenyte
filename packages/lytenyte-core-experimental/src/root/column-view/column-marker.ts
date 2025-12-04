import { COLUMN_MARKER_ID } from "@1771technologies/lytenyte-shared";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-shared";
import type { Ln } from "../../types.js";

interface ColumnHandleMarkerArgs<T> {
  readonly columns: Ln.LnColumn<T>[];
  readonly marker: Ln.ColumnMarker<T>;
  readonly markerEnabled: boolean;
}

export function columnHandleMarker<T>({
  columns,
  marker,
  markerEnabled,
}: ColumnHandleMarkerArgs<T>) {
  const lookup = itemsWithIdToMap(columns);

  if (markerEnabled && !lookup.has(COLUMN_MARKER_ID)) {
    columns = [
      {
        id: COLUMN_MARKER_ID,
        name: "",
        pin: "start",
        width: marker.width ?? 30,
        widthMin: 24,
        cellRenderer: marker.cellRenderer,
        headerRenderer: marker.headerRenderer,
        floatingCellRenderer: marker.floatingCellRenderer,
      } as Ln.Column<any>,
      ...columns,
    ];
    lookup.set(COLUMN_MARKER_ID, columns[0]);
  } else if (!markerEnabled && lookup.has(COLUMN_MARKER_ID)) {
    const index = columns.findIndex((c) => c.id === COLUMN_MARKER_ID);
    columns.splice(index, 1);
  }

  if (markerEnabled) {
    const column = lookup.get(COLUMN_MARKER_ID) as any;

    // The marker column must always be the first column displayed in the grid.
    const index = columns.findIndex((c) => c.id === COLUMN_MARKER_ID);
    if (index !== 0) {
      columns.splice(index, 1);
      columns.unshift(column);
    }
  }

  return columns;
}
