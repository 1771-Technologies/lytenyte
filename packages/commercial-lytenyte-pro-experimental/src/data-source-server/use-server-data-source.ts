import { useMemo } from "react";
import type { DataRequest, DataResponse, DataResponsePinned, QueryFnParams } from "./types";
import { usePiece, type Piece } from "@1771technologies/lytenyte-core-experimental/internal";
import { type RowSource } from "@1771technologies/lytenyte-shared";
import { useRowByIndex } from "./source/use-row-by-index.js";
import { useGlobalRefresh } from "../data-source-client/source/use-global-refresh.js";
import { useRowIndexToRowId } from "./source/use-row-index-to-row-id.js";
import { useRowIdToRowIndex } from "./source/use-row-id-to-row-index.js";
import { useRowById } from "./source/use-row-by-id.js";
import { useOnViewChange } from "./source/use-on-view-change.js";
import { useSourceState } from "./source/use-source-state.js";
import { useSource } from "./source/use-source.js";

export interface RowSourceServer<T> extends RowSource<T> {
  isLoading: Piece<boolean>;
  loadingError: Piece<unknown>;
  requestsForView: Piece<DataRequest[]>;
}

export interface UseServerDataSourceParams<K extends unknown[]> {
  readonly queryFn: (params: QueryFnParams<K>) => Promise<(DataResponse | DataResponsePinned)[]>;
  readonly queryKey: K;
  readonly blockSize?: number;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;
}

export function useServerDataSource<T, K extends unknown[] = unknown[]>(
  props: UseServerDataSourceParams<K>,
): RowSourceServer<T> {
  const s = useSourceState(props);

  const isLoading$ = usePiece(s.isLoading);
  const loadError$ = usePiece(s.loadingError);
  const requestsForView$ = usePiece(s.requestsForView, s.setRequestsForView);

  const top$ = usePiece(s.topCount);
  const bot$ = usePiece(s.botCount);
  const maxDepth$ = usePiece(s.maxDepth);
  const rowCount$ = usePiece(s.rowCount);

  const globalSignal = useGlobalRefresh();
  const source = useSource(props, s, globalSignal);

  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(source, globalSignal);
  const rowById = useRowById<T>(source);
  const rowIdToRowIndex = useRowIdToRowIndex<T>(source);
  const rowIndexToRowId = useRowIndexToRowId<T>(source);
  const onViewChange = useOnViewChange(source, s.requestsForView, s.setRequestsForView);

  const setExpansions = s.setExpansions;
  const rowSource = useMemo<RowSourceServer<T>>(() => {
    const rowSource: RowSourceServer<T> = {
      rowById,
      rowByIndex,
      rowInvalidate,
      rowIdToRowIndex,
      rowIndexToRowId,
      rowChildren: () => [],
      rowIsSelected: () => false,

      rowLeafs: () => {
        console.error(
          "The LyteNyte Grid Server Data Source does not support requesting leaf values for a given row.",
        );
        return [];
      },
      rowParents: (id) => {
        const rowIndex = rowIdToRowIndex(id);
        if (rowIndex == null) return [];

        const ranges = source.flat.rangeTree.findRangesForRowIndex(rowIndex);
        console.log(ranges);

        return [];
      },
      rowsBetween: () => [],
      rowsSelected: () => [],

      useTopCount: () => top$.useValue(),
      useRowCount: () => rowCount$.useValue(),
      useBottomCount: () => bot$.useValue(),
      useMaxRowGroupDepth: () => maxDepth$.useValue(),

      useSnapshotVersion: () => 0,

      onRowGroupExpansionChange: (deltaChanges) => {
        setExpansions((prev) => ({ ...prev, ...deltaChanges }));
      },
      onRowsSelected: () => {},
      onRowsUpdated: () => {},
      onViewChange,
      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,
    };

    return rowSource;
  }, [
    bot$,
    isLoading$,
    loadError$,
    maxDepth$,
    onViewChange,
    requestsForView$,
    rowById,
    rowByIndex,
    rowCount$,
    rowIdToRowIndex,
    rowIndexToRowId,
    rowInvalidate,
    setExpansions,
    source,
    top$,
  ]);

  return rowSource;
}
