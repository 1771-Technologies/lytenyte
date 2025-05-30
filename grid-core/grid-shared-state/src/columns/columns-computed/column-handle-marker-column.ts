import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";
import type {
  ColumnCore,
  RowSelectionCheckboxCore,
  RowSelectionModeCore,
} from "@1771technologies/grid-types/core";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

interface ColumnHandleMarkerArgs<D, E> {
  readonly columns: ColumnCore<D, E>[];
  readonly rowSelectionCheckbox: RowSelectionCheckboxCore;
  readonly rowSelectionMode: RowSelectionModeCore;
  readonly rowDragEnabled: boolean;
  readonly rowDetailEnabled: boolean;
  readonly rowDetailMarker: boolean;
}

export function columnHandleMarker<D, E>({
  columns,
  rowDragEnabled,
  rowSelectionCheckbox,
  rowSelectionMode,
  rowDetailEnabled,
  rowDetailMarker,
}: ColumnHandleMarkerArgs<D, E>) {
  const markerForRowSelection = rowSelectionMode !== "none" && rowSelectionCheckbox !== "hide";
  const markerForRowDetail = rowDetailEnabled && rowDetailMarker;
  const markerForRowDrag = rowDragEnabled;

  const hasMarkerColumn = markerForRowDrag || markerForRowDetail || markerForRowSelection;

  const lookup = itemsWithIdToMap(columns);

  if (hasMarkerColumn && !lookup.has(COLUMN_MARKER_ID)) {
    columns = [
      { id: COLUMN_MARKER_ID, headerName: "", pin: "start", width: 30, widthMin: 30, widthMax: 30 },
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
