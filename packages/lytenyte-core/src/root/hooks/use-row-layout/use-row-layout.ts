import {
  createRowLayout,
  type ColumnView,
  type GridSections,
  type RowSource,
  type RowView,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type { Piece } from "../../../hooks/use-piece.js";
import { useCallback, useMemo } from "react";
import { getSpanFn } from "./get-span-fn.js";
import { getFullWidthFn } from "./get-full-width-fn.js";
import type { Root } from "../../root.js";

export function useRowLayout(
  props: Root.Props,
  sections: GridSections,
  rs: RowSource,
  view: ColumnView,
  vp: HTMLElement | null,
  api: Root.API,
  bounds$: Piece<SpanLayout>,
  rowDetailExpansions: Set<string>,
) {
  const bounds = bounds$.useValue();

  const rows = rs.useRows();
  const rowByIndex = useCallback(
    (i: number) => {
      return rows.get(i);
    },
    [rows],
  );

  const columns = view.visibleColumns;
  const [computeColSpan, computeRowSpan] = useMemo(() => {
    return [
      getSpanFn(rowByIndex, columns as any, "col", api),
      getSpanFn(rowByIndex, columns as any, "row", api),
    ];
  }, [api, columns, rowByIndex]);

  const isFullWidth = useMemo(() => {
    if (!props.rowFullWidthPredicate) return null;

    return getFullWidthFn(rowByIndex, props.rowFullWidthPredicate, api);
  }, [api, props.rowFullWidthPredicate, rowByIndex]);

  const isRowCutoff = useCallback(
    (r: number) => {
      const row = rowByIndex(r);

      return !row || row.kind === "branch" || rowDetailExpansions.has(row.id);
    },
    [rowByIndex, rowDetailExpansions],
  );

  const rowLayout = useMemo(() => {
    const l = createRowLayout({
      topCutoff: sections.topCutoff,
      bottomCutoff: sections.bottomCutoff,
      startCutoff: sections.startCutoff,
      endCutoff: sections.endCutoff,
      columns: view.visibleColumns,
      computeColSpan,
      computeRowSpan,
      hasSpans: Boolean(computeColSpan || computeRowSpan),
      isCutoff: isRowCutoff,
      isFullWidth: isFullWidth,
      rowByIndex,
      rowLookback: 100,
    });

    return l;
  }, [
    computeColSpan,
    computeRowSpan,
    isFullWidth,
    isRowCutoff,
    rowByIndex,
    sections.bottomCutoff,
    sections.endCutoff,
    sections.startCutoff,
    sections.topCutoff,
    view.visibleColumns,
  ]);

  const rowView = useMemo<RowView>(() => {
    if (!vp) return { top: [], bottom: [], center: [], rowFirstCenter: 0, rowFocusedIndex: null };

    let n = bounds;
    if (props.virtualizeRows === false)
      n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
    if (props.virtualizeCols === false)
      n = { ...n, colCenterStart: n.colStartEnd, colCenterEnd: n.colCenterLast };

    const top = Array.from({ length: n.rowTopEnd }, (_, i) => rowLayout.layoutByIndex(i)!);
    const center = Array.from(
      { length: n.rowCenterEnd - n.rowCenterStart },
      (_, i) => rowLayout.layoutByIndex(i + n.rowCenterStart)!,
    );
    const bottom = Array.from(
      { length: n.rowBotEnd - n.rowBotStart },
      (_, i) => rowLayout.layoutByIndex(i + n.rowBotStart)!,
    );

    return {
      rowFirstCenter: n.rowCenterStart,
      rowFocusedIndex: null,
      top,
      center,
      bottom,
    };
  }, [bounds, props.virtualizeCols, props.virtualizeRows, rowLayout, vp]);

  return { rowView, rowLayout };
}
