import { useRef, useState } from "react";
import type { DataRequest } from "../types";
import { useControlled } from "@1771technologies/lytenyte-core-experimental/internal";
import type { UseServerDataSourceParams } from "../use-server-data-source";
import type { RowNode } from "@1771technologies/lytenyte-shared";

export type SourceState = ReturnType<typeof useSourceState>;

export function useSourceState<K extends unknown[]>(props: UseServerDataSourceParams<K, unknown[]>) {
  const [rows, setRows] = useState<Map<number, RowNode<any>>>(new Map());
  const [maxDepth, setMaxDepth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<unknown>(null);
  const [requestsForView, setRequestsForView] = useState<DataRequest[]>([]);

  const [topCount, setTopCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [botCount, setBotCount] = useState(0);

  const [expansions, setExpansions] = useControlled({
    controlled: props.rowGroupExpansions,
    default: {},
  });

  const state = {
    isLoading,
    setIsLoading,
    loadingError,
    setLoadingError,
    requestsForView,
    setRequestsForView,

    topCount,
    setTopCount,
    botCount,
    setBotCount,
    rowCount,
    setRowCount,

    expansions,
    setExpansions,

    maxDepth,
    setMaxDepth,

    rows,
    setRows,
  };

  // React is stupid sometimes.
  const stateRef = useRef(state);
  Object.assign(stateRef.current, state);

  return stateRef.current;
}
