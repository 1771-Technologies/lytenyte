import { useEffect, useMemo, useRef, useState } from "react";
import type { DataRequest } from "../types";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { UseServerDataSourceParams } from "../use-server-data-source";
import type { RowSelectionState } from "@1771technologies/lytenyte-shared";
import {
  arrayShallow,
  rowSelectLinkWithoutParents,
  rowSelectLinkWithParents,
  type RowSelectionStateWithParent,
} from "@1771technologies/lytenyte-shared";

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

  const [rawSelections, setRawSelections] = useControlled<RowSelectionState>({
    controlled: props.rowSelection,
    default: isolatedSelected
      ? { kind: "isolated", selected: false, exceptions: new Set() }
      : { kind: "controlled", selected: false, children: new Map() },
  });

  const selections = useMemo<RowSelectionStateWithParent>(() => {
    if (isolatedSelected) {
      if (rawSelections.kind === "controlled")
        return { kind: "isolated", selected: false, exceptions: new Set() };
      return rawSelections;
    }
    return rowSelectLinkWithParents(rawSelections);
  }, [isolatedSelected, rawSelections]);

  const setSelected = useEvent(
    (
      s: RowSelectionStateWithParent | ((prev: RowSelectionStateWithParent) => RowSelectionStateWithParent),
    ) => {
      const nextState = typeof s === "function" ? s(selections) : s;

      const without: RowSelectionState = isolatedSelected
        ? nextState.kind !== "isolated"
          ? { kind: "isolated", selected: false, exceptions: new Set() }
          : nextState
        : nextState.kind !== "controlled"
          ? { kind: "controlled", selected: false, children: new Map() }
          : rowSelectLinkWithoutParents(nextState);

      setRawSelections(without);
      props.onRowSelectionChange?.(without);
    },
  );

  const selectionKey = props.rowSelectKey ?? props.queryKey;
  const ref = useRef(selectionKey);
  const refIso = useRef(isolatedSelected);
  useEffect(() => {
    if (arrayShallow(ref.current, selectionKey) && refIso.current === isolatedSelected) return;

    ref.current = selectionKey;
    refIso.current = isolatedSelected;

    setSelected(() =>
      isolatedSelected
        ? { kind: "isolated", selected: false, exceptions: new Set() }
        : { kind: "controlled", selected: false, children: new Map() },
    );
  }, [isolatedSelected, selectionKey, setSelected]);

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

    rawSelections,
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
