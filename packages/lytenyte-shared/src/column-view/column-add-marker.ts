import { COLUMN_MARKER_ID, type ColumnAbstract } from "@1771technologies/lytenyte-shared";

interface ColumnHandleMarkerArgs {
  readonly columns: ColumnAbstract[];
  readonly marker: Omit<ColumnAbstract, "id">;
  readonly markerEnabled: boolean;
}

export function columnAddMarker({ columns, marker, markerEnabled }: ColumnHandleMarkerArgs) {
  if (markerEnabled) {
    columns = [
      {
        name: "",
        width: marker.width ?? 30,
        widthMin: 24,
        ...marker,
        pin: "start",
        id: COLUMN_MARKER_ID,
      },
      ...columns,
    ];
  }

  return columns;
}
