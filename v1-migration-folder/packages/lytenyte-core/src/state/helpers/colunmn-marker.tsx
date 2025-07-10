import { COLUMN_MARKER_ID } from "@1771technologies/lytenyte-shared";
import type { Column, ColumnMarker, RowSelectionCheckbox, RowSelectionMode } from "../../+types";
import { itemsWithIdToMap } from "@1771technologies/lytenyte-js-utils";

interface ColumnHandleMarkerArgs<T> {
  readonly columns: Column<T>[];
  readonly rowSelectionCheckbox: RowSelectionCheckbox;
  readonly rowSelectionMode: RowSelectionMode;
  readonly rowDragEnabled: boolean;
  readonly rowDetailEnabled: boolean;
  readonly rowDetailMarker: boolean;
  readonly marker: ColumnMarker<T>;
}

export function columnHandleMarker<T>({
  columns,
  rowDragEnabled,
  rowSelectionCheckbox,
  rowSelectionMode,
  rowDetailEnabled,
  rowDetailMarker,
  marker,
}: ColumnHandleMarkerArgs<T>) {
  const markerForRowSelection = rowSelectionMode !== "none" && rowSelectionCheckbox !== "hide";
  const markerForRowDetail = rowDetailEnabled && rowDetailMarker;
  const markerForRowDrag = rowDragEnabled;

  const hasMarkerColumn = markerForRowDrag || markerForRowDetail || markerForRowSelection;

  const lookup = itemsWithIdToMap(columns);

  if (hasMarkerColumn && !lookup.has(COLUMN_MARKER_ID)) {
    columns = [
      {
        id: COLUMN_MARKER_ID,
        name: "",
        pin: "start",
        width: 30,
        widthMin: 30,
        widthMax: 30,
        cellRenderer: marker.cellRenderer,
        headerRenderer: marker.headerRenderer ?? HeaderRenderer,
        floatingRenderer: marker.floatingRenderer ?? FloatingRenderer,
      },
      ...columns,
    ];
    lookup.set(COLUMN_MARKER_ID, columns[0]);
  } else if (!hasMarkerColumn && lookup.has(COLUMN_MARKER_ID)) {
    const index = columns.findIndex((c) => c.id === COLUMN_MARKER_ID);
    columns.splice(index, 1);
  }

  if (hasMarkerColumn) {
    const enables = [markerForRowDetail, markerForRowDrag, markerForRowSelection].filter(Boolean);
    const width = enables.length * 30;

    const column = lookup.get(COLUMN_MARKER_ID) as any;

    column.width = width;
    column.widthMin = width;
    column.widthMax = width;

    // The marker column must always be the first column displayed in the grid.
    const index = columns.findIndex((c) => c.id === COLUMN_MARKER_ID);
    if (index !== 0) {
      columns.splice(index, 1);
      columns.unshift(column);
    }
  }

  return columns;
}

function HeaderRenderer() {
  return (
    <>
      <div style={{ overflow: "hidden", opacity: 0, width: "100%", height: "100%" }}>
        Marker column default
      </div>
    </>
  );
}
function FloatingRenderer() {
  return <></>;
}
