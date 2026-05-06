import {
  createRowLayout,
  type PartialMandatory,
  type RowLayout,
  type RowSource,
  type RowView,
} from "@1771technologies/lytenyte-shared";
import { createContext, memo, useCallback, useContext, useMemo, type PropsWithChildren } from "react";
import type { Root } from "../../root";
import { useCutoffContext } from "../grid-areas/cutoff-context.js";
import { useColumnsContext } from "../columns/column-context.js";
import { useViewportContext } from "../viewport/viewport-context.js";
import type { API } from "../../../types";
import { useBoundsContext } from "../bounds.js";
import { useRowDetailContext } from "../row-detail.js";
import { getFullWidthFn } from "./get-full-width-fn.js";
import { getSpanFn } from "./get-span-fn.js";

const rowViewContext = createContext(null as unknown as RowView);
const rowLayoutContext = createContext(null as unknown as RowLayout);

type Props = Pick<
  PartialMandatory<Root.Props>,
  "rowFullWidthPredicate" | "virtualizeCols" | "virtualizeRows"
> & { source: RowSource; api: API };

export const RowLayoutProvider = memo(
  ({
    api,
    source,
    rowFullWidthPredicate,
    virtualizeCols,
    virtualizeRows,
    children,
  }: PropsWithChildren<Props>) => {
    const cutoffs = useCutoffContext();
    const { view } = useColumnsContext();
    const { viewport: vp } = useViewportContext();
    const bounds = useBoundsContext();
    const { detailExpansions } = useRowDetailContext();

    const rows = source.useRows();
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
      if (!rowFullWidthPredicate) return null;

      return getFullWidthFn(rowByIndex, rowFullWidthPredicate, api);
    }, [api, rowFullWidthPredicate, rowByIndex]);

    const isRowCutoff = useCallback(
      (r: number) => {
        const row = rowByIndex(r);

        return !row || row.kind === "branch" || detailExpansions.has(row.id);
      },
      [rowByIndex, detailExpansions],
    );

    const rowLayout = useMemo(() => {
      const l = createRowLayout({
        topCutoff: cutoffs.topCutoff,
        rowCenterCutoff: cutoffs.bottomCutoff,
        bottomCutoff: cutoffs.rowCount,
        startCutoff: cutoffs.startCutoff,
        centerCutoff: cutoffs.endCutoff,
        endCutoff: view.visibleColumns.length,
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
      cutoffs.topCutoff,
      cutoffs.bottomCutoff,
      cutoffs.rowCount,
      cutoffs.startCutoff,
      cutoffs.endCutoff,
      view.visibleColumns,
      computeColSpan,
      computeRowSpan,
      isRowCutoff,
      isFullWidth,
      rowByIndex,
    ]);

    const rowView = useMemo<RowView>(() => {
      if (!vp) return { top: [], bottom: [], center: [], rowFirstCenter: 0, rowFocusedIndex: null };

      let n = bounds;
      if (virtualizeRows === false) n = { ...n, rowCenterStart: n.rowTopEnd, rowCenterEnd: n.rowCenterLast };
      if (virtualizeCols === false)
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
    }, [bounds, virtualizeCols, virtualizeRows, rowLayout, vp]);

    return (
      <rowViewContext.Provider value={rowView}>
        <rowLayoutContext.Provider value={rowLayout}>{children}</rowLayoutContext.Provider>
      </rowViewContext.Provider>
    );
  },
);

export const useRowLayoutContext = () => useContext(rowLayoutContext);
export const useRowViewContext = () => useContext(rowViewContext);
