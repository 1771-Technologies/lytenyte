import { makeColumnView, type ColumnAbstract, type RowSource } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Root } from "../root";

export function useColumnView(
  columns: ColumnAbstract[],
  props: Root.Props,
  source: RowSource,
  columnGroupExpansions: Record<string, boolean>,
) {
  const maxRowDepth = source.useMaxRowGroupDepth();

  const columnView = useMemo(() => {
    const columnView = makeColumnView({
      columns,
      rowGroupDepth: maxRowDepth,
      rowGroupTemplate: props.rowGroupColumn ?? {},
      marker: props.columnMarker ?? {},
      base: props.columnBase ?? {},
      groupExpansionDefault: props.columnGroupDefaultExpansion ?? true,
      groupExpansions: columnGroupExpansions,
      groupJoinDelimiter: props.columnGroupJoinDelimiter ?? "/",
      filledDepth: false,
      lastGroupShouldFill: false,
    });

    return columnView;
  }, [
    columnGroupExpansions,
    columns,
    maxRowDepth,
    props.columnBase,
    props.columnGroupDefaultExpansion,
    props.columnGroupJoinDelimiter,
    props.columnMarker,
    props.rowGroupColumn,
  ]);

  return columnView;
}
