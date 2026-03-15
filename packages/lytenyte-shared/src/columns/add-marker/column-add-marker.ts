import { COLUMN_MARKER_ID } from "../../+constants.js";
import type { ColumnAbstract } from "../../types.js";

interface ColumnHandleMarkerArgs {
  readonly columns: ColumnAbstract[];
  readonly marker: Omit<ColumnAbstract, "id"> & { on?: boolean };
}

/**
 * The column marker is a special LyteNyte Grid column, that is controlled and managed by LyteNyte Grid.
 * This function will add the marker column to the set of columns provided by the user. It will only
 * add the marker column if it is enabled.
 */
export function columnAddMarker({ columns, marker }: ColumnHandleMarkerArgs) {
  if (marker.on) {
    columns = [
      { name: "", width: marker.width ?? 30, widthMin: 24, ...marker, pin: "start", id: COLUMN_MARKER_ID },
      ...columns,
    ];
  }

  return columns;
}
