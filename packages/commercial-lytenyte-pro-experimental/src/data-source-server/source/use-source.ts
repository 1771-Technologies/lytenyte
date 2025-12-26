import { useEffect, useMemo, useRef } from "react";
import type { UseServerDataSourceParams } from "../use-server-data-source";
import { arrayShallow } from "@1771technologies/lytenyte-shared";
import { useEvent, type Signal } from "@1771technologies/lytenyte-core-experimental/internal";
import { ServerData, type DataFetcher } from "../server-data.js";
import type { SourceState } from "./use-source-state";

export function useSource<K extends unknown[]>(
  props: UseServerDataSourceParams<K, unknown[]>,
  s: SourceState,
  globalSignal: Signal<number>,
) {
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
        s.setMaxDepth(f.maxDepth);
        s.setRows(f.rowIndexToRow);

        // Not sure why this is being flagged. This is not being used in hook. This is also fine. We don't
        // actually care about the value, just that it will be different from the previous value.
        // eslint-disable-next-line react-hooks/purity
        globalSignal(Date.now());
      },
    });
  }

  useEffect(() => {
    sourceRef.current.dataFetcher = dataFetcher;
  }, [dataFetcher]);

  const prevExpansions = useRef(s.expansions);
  useEffect(() => {
    if (prevExpansions.current === s.expansions) return;
    prevExpansions.current = s.expansions;

    sourceRef.current.expansions = s.expansions;
  }, [s.expansions]);

  return sourceRef.current;
}
