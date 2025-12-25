import { useEffect, useRef, useState } from "react";
import type { DataRequest, ServerRowSelection } from "../types";
import { useControlled } from "@1771technologies/lytenyte-core-experimental/internal";
import type { UseServerDataSourceParams } from "../use-server-data-source";
import { arrayShallow } from "@1771technologies/lytenyte-shared";

export type SourceState = ReturnType<typeof useSourceState>;

export function useSourceState<K extends unknown[]>(
  props: UseServerDataSourceParams<K, unknown[]>,
  isolatedSelected: boolean,
) {
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
  const [selections, setSelected] = useState<ServerRowSelection>(
    isolatedSelected ? { kind: "isolated", selected: new Set() } : { kind: "leafs", selected: new Set() },
  );

  const selectionKey = props.rowSelectKey ?? props.queryKey;
  const ref = useRef(selectionKey);
  const refIso = useRef(isolatedSelected);
  useEffect(() => {
    if (arrayShallow(ref.current, selectionKey) && refIso.current === isolatedSelected) return;

    ref.current = selectionKey;
    refIso.current = isolatedSelected;

    if (isolatedSelected) setSelected({ kind: "isolated", selected: new Set() });
    else setSelected({ kind: "leafs", selected: new Set() });
  }, [isolatedSelected, selectionKey]);

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

    selections,
    setSelected,

    maxDepth,
    setMaxDepth,
  };

  // React is stupid sometimes.
  const stateRef = useRef(state);
  Object.assign(stateRef.current, state);

  return stateRef.current;
}
