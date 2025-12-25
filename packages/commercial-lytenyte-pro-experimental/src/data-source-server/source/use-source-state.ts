import { useState } from "react";
import type { DataRequest } from "../types";
import { useControlled } from "@1771technologies/lytenyte-core-experimental/internal";
import type { UseServerDataSourceParams } from "../use-server-data-source";

export function useSourceState<K extends unknown[]>(props: UseServerDataSourceParams<K>) {
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

  return {
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
  };
}
