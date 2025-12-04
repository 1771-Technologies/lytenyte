import { useMemo } from "react";
import { columnHandleMarker } from "./column-marker.js";
import { makeColumnView } from "./column-view.js";
import type { Ln } from "../../types.js";

export function useColumnView<T>(
  columns: Ln.LnColumn<T>[],
  base: Ln.ColumnBase<T>,
  groupExpansionDefault: boolean,
  groupExpansions: Record<string, boolean>,
  groupJoinDelimiter: string,
  markerEnabled: boolean,
  marker: Ln.ColumnMarker<T>,
) {
  return useMemo(() => {
    const colsWithMarker = columnHandleMarker({
      columns,
      marker,
      markerEnabled,
    });

    return makeColumnView({
      columns: colsWithMarker,
      base,
      groupExpansionDefault,
      groupExpansions,
      groupJoinDelimiter,
    });
  }, [
    base,
    columns,
    groupExpansionDefault,
    groupExpansions,
    groupJoinDelimiter,
    marker,
    markerEnabled,
  ]);
}
