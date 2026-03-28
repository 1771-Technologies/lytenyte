import { makeColumnView, type ColumnAbstract, type RowSource } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Root } from "../root";

const EMPTY_ARRAY: ColumnAbstract[] = [];

export function useColumnView(
  props: Root.Props,
  source: RowSource,
  columnGroupExpansions: Record<string, boolean>,
) {
  const maxRowDepth = source.useMaxRowGroupDepth();

  const columnView = useMemo(() => {
    const columnView = makeColumnView({
      columns: props.columns ?? EMPTY_ARRAY,
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
    maxRowDepth,
    props.columnBase,
    props.columnGroupDefaultExpansion,
    props.columnGroupJoinDelimiter,
    props.columnMarker,
    props.columns,
    props.rowGroupColumn,
  ]);

  return columnView;
}
