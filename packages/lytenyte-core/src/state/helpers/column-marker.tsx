import { COLUMN_MARKER_ID } from "@1771technologies/lytenyte-shared";
import type { Column, ColumnMarker } from "../../+types.js";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-shared";

interface ColumnHandleMarkerArgs<T> {
  readonly columns: Column<T>[];
  readonly marker: ColumnMarker<T>;
  readonly markerEnabled: boolean;
}

export function columnHandleMarker<T>({ columns, marker, markerEnabled }: ColumnHandleMarkerArgs<T>) {
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
        headerRenderer: marker.headerRenderer ?? HeaderRenderer,
        floatingCellRenderer: marker.floatingCellRenderer ?? FloatingRenderer,
        uiHints: marker.uiHints,
      },
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

// eslint-disable-next-line react-refresh/only-export-components
function HeaderRenderer() {
  return (
    <>
      <div style={{ overflow: "hidden", opacity: 0, width: "100%", height: "100%" }}>
        Marker column default
      </div>
    </>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
function FloatingRenderer() {
  return <></>;
}
