import { useEffect, useMemo, useRef, useState } from "react";
import type { DataRequest, DataResponse, DataResponsePinned, QueryFnParams } from "./types";
import {
  useControlled,
  useEvent,
  usePiece,
  type Piece,
} from "@1771technologies/lytenyte-core-experimental/internal";
import { ServerData, type DataFetcher } from "./server-data.js";
import { arrayShallow, type RowSource } from "@1771technologies/lytenyte-shared";
import { useRowByIndex } from "./source/use-row-by-index.js";
import { useGlobalRefresh } from "../data-source-client/source-functions/use-global-refresh.js";

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<unknown>(null);
  const [requestsForView] = useState<DataRequest[]>([]);

  const [topCount, setTopCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [botCount, setBotCount] = useState(0);

  const [expansions] = useControlled({
    controlled: props.rowGroupExpansions,
    default: {},
  });

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
      expansions,
      pivotExpansions: {}, // TODO
      pivotMode: false, // TODO
      onResetLoadBegin: () => {
        setIsLoading(true);
        setLoadingError(null);
      },
      onInvalidate: () => {}, // TODO
      onResetLoadEnd: () => setIsLoading(false),
      onResetLoadError: (e) => setLoadingError(e),
      onFlatten: (f) => {
        setTopCount(f.top);
        setBotCount(f.bottom);
        setRowCount(f.center + f.top + f.bottom);
      },
    });
  }

  useEffect(() => {
    sourceRef.current.dataFetcher = dataFetcher;
  }, [dataFetcher]);

  const isLoading$ = usePiece(isLoading);
  const loadError$ = usePiece(loadingError);
  const requestsForView$ = usePiece(requestsForView);
  const top$ = usePiece(topCount);
  const bot$ = usePiece(botCount);
  const rowCount$ = usePiece(rowCount);

  // Source from here down

  const globalSignal = useGlobalRefresh();
  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(sourceRef.current, globalSignal);

  const rowSource = useMemo<RowSourceServer<T>>(() => {
    const source: RowSourceServer<T> = {
      rowById: () => null,
      rowByIndex,
      rowInvalidate,
      rowIdToRowIndex: () => null,
      rowIndexToRowId: () => null,
      rowChildren: () => [],
      rowIsSelected: () => false,
      rowLeafs: () => [],
      rowParents: () => [],
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

      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,
    };

    return source;
  }, [bot$, isLoading$, loadError$, requestsForView$, rowByIndex, rowCount$, rowInvalidate, top$]);

  return rowSource;
}
