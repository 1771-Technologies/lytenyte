import { useEffect, useMemo, useRef } from "react";
import type { DataRequest, DataResponse, DataResponsePinned, QueryFnParams } from "./types";
import { useEvent, usePiece, type Piece } from "@1771technologies/lytenyte-core-experimental/internal";
import { ServerData, type DataFetcher } from "./server-data.js";
import { arrayShallow, type RowSource } from "@1771technologies/lytenyte-shared";
import { useRowByIndex } from "./source/use-row-by-index.js";
import { useGlobalRefresh } from "../data-source-client/source/use-global-refresh.js";
import { useRowIndexToRowId } from "./source/use-row-index-to-row-id.js";
import { useRowIdToRowIndex } from "./source/use-row-id-to-row-index.js";
import { useRowById } from "./source/use-row-by-id.js";
import { useOnViewChange } from "./source/use-on-view-change.js";
import { useSourceState } from "./source/use-source-state.js";

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

  const prevQueryKeyRef = useRef(null as any);
  const queryKey = useMemo(() => {
    const current = prevQueryKeyRef.current;
    if (!current) {
      prevQueryKeyRef.current = props.queryKey;
      return prevQueryKeyRef.current;
    }

    if (!arrayShallow(current, props.queryKey)) {
      prevQueryKeyRef.current = props.queryKey;
    }

    return prevQueryKeyRef.current;
  }, [props.queryKey]);

  const queryFn = useEvent(props.queryFn);
  const dataFetcher = useMemo<DataFetcher>(() => {
    const fetcher: DataFetcher = (req, expansions) => {
      const model = { rowGroupExpansions: expansions };
      return queryFn({ model, queryKey, reqTime: Date.now(), requests: req });
    };

    return fetcher;
  }, [queryFn, queryKey]);

  const sourceRef = useRef<ServerData>(null as unknown as ServerData);
  if (!sourceRef.current) {
    sourceRef.current = new ServerData({
      defaultExpansion: props.rowGroupDefaultExpansion ?? false,
      blocksize: props.blockSize ?? 200,
      expansions: s.expansions,
      pivotExpansions: {}, // TODO
      pivotMode: false, // TODO
      onResetLoadBegin: () => {
        s.setIsLoading(true);
        s.setLoadingError(null);
      },
      onInvalidate: () => {}, // TODO
      onResetLoadEnd: () => s.setIsLoading(false),
      onResetLoadError: (e) => s.setLoadingError(e),
      onFlatten: (f) => {
        s.setTopCount(f.top);
        s.setBotCount(f.bottom);
        s.setRowCount(f.center + f.top + f.bottom);

        globalSignal(Date.now());
      },
    });
  }

  useEffect(() => {
    sourceRef.current.dataFetcher = dataFetcher;
  }, [dataFetcher]);

  const isLoading$ = usePiece(s.isLoading);
  const loadError$ = usePiece(s.loadingError);
  const requestsForView$ = usePiece(s.requestsForView, s.setRequestsForView);

  const top$ = usePiece(s.topCount);
  const bot$ = usePiece(s.botCount);
  const rowCount$ = usePiece(s.rowCount);

  // Source from here down
  const globalSignal = useGlobalRefresh();

  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(sourceRef.current, globalSignal);
  const rowById = useRowById<T>(sourceRef.current);
  const rowIdToRowIndex = useRowIdToRowIndex<T>(sourceRef.current);
  const rowIndexToRowId = useRowIndexToRowId<T>(sourceRef.current);
  const onViewChange = useOnViewChange(sourceRef.current, s.requestsForView, s.setRequestsForView);

  const rowSource = useMemo<RowSourceServer<T>>(() => {
    const source: RowSourceServer<T> = {
      rowById,
      rowByIndex,
      rowInvalidate,
      rowIdToRowIndex,
      rowIndexToRowId,
      rowChildren: () => [],
      rowIsSelected: () => false,

      rowLeafs: () => [],
      rowParents: (id) => {
        const rowIndex = rowIdToRowIndex(id);
        if (rowIndex == null) return [];

        const ranges = sourceRef.current.flat.rangeTree.findRangesForRowIndex(rowIndex);
        console.log(ranges);

        return [];
      },
      rowsBetween: () => [],
      rowsSelected: () => [],

      useTopCount: () => top$.useValue(),
      useRowCount: () => rowCount$.useValue(),
      useBottomCount: () => bot$.useValue(),

      useMaxRowGroupDepth: () => 0,
      useSnapshotVersion: () => 0,

      onRowGroupExpansionChange: () => {},
      onRowsSelected: () => {},
      onRowsUpdated: () => {},
      onViewChange,
      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,
    };

    return source;
  }, [
    bot$,
    isLoading$,
    loadError$,
    onViewChange,
    requestsForView$,
    rowById,
    rowByIndex,
    rowCount$,
    rowIdToRowIndex,
    rowIndexToRowId,
    rowInvalidate,
    top$,
  ]);

  return rowSource;
}
