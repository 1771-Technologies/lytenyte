import { columnAddMarker, columnAddRowGroup, makeColumnView, type RowSource } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Props } from "../../types/types-internal";

export function useColumnView(props: Props, source: RowSource, columnGroupExpansions: Record<string, boolean>) {
  const maxRowDepth = source.useMaxRowGroupDepth();

  const view = useMemo(() => {
    const colsWithGroup = columnAddRowGroup({
      columns: props.columns ?? [],
      rowGroupDepth: maxRowDepth,
      rowGroupDisplayMode: props.rowGroupDisplayMode ?? "single-column",
      rowGroupTemplate: props.rowGroupColumn ?? {},
    });

    const colsWithMarker = columnAddMarker({
      columns: colsWithGroup,
      marker: props.columnMarker ?? {},
      markerEnabled: props.columnMarkerEnabled ?? false,
    });

    const view = makeColumnView({
      columns: colsWithMarker,
      base: props.columnBase ?? {},
      groupExpansionDefault: props.columnGroupDefaultExpansion ?? true,
      groupExpansions: columnGroupExpansions,
      groupJoinDelimiter: props.columnGroupJoinDelimiter ?? "/",
    });

    return view;
  }, [
    columnGroupExpansions,
    maxRowDepth,
    props.columnBase,
    props.columnGroupDefaultExpansion,
    props.columnGroupJoinDelimiter,
    props.columnMarker,
    props.columnMarkerEnabled,
    props.columns,
    props.rowGroupColumn,
    props.rowGroupDisplayMode,
  ]);

  return view;
}
