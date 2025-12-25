import { useMemo } from "react";
import type {
  DataRequest,
  DataResponse,
  DataResponsePinned,
  QueryFnParams,
  ServerRowSelection,
} from "./types";
import { useEvent, usePiece, type Piece } from "@1771technologies/lytenyte-core-experimental/internal";
import { type RowGroup, type RowLeaf, type RowNode, type RowSource } from "@1771technologies/lytenyte-shared";
import { useRowByIndex } from "./source/use-row-by-index.js";
import { useGlobalRefresh } from "../data-source-client/source/use-global-refresh.js";
import { useRowIndexToRowId } from "./source/use-row-index-to-row-id.js";
import { useRowIdToRowIndex } from "./source/use-row-id-to-row-index.js";
import { useRowById } from "./source/use-row-by-id.js";
import { useOnViewChange } from "./source/use-on-view-change.js";
import { useSourceState } from "./source/use-source-state.js";
import { useSource } from "./source/use-source.js";
import { useRowParents } from "./source/use-row-parents.js";
import { useRowsBetween } from "./source/use-rows-between.js";
import { useRowChildren } from "./source/use-row-children.js";
import { useRowIsSelected } from "./source/use-row-is-selected.js";

export interface RowSourceServer<T> extends RowSource<T> {
  readonly isLoading: Piece<boolean>;
  readonly loadingError: Piece<unknown>;
  readonly requestsForView: Piece<DataRequest[]>;

  readonly rowsSelected: () =>
    | { kind: "all"; exceptions: string[]; loaded: Map<string, RowNode<T>>[] }
    | {
        kind: "leafs-and-groups";
        selected: (
          | { kind: "leaf"; row: RowLeaf<T> }
          | { kind: "group"; row: RowGroup; exceptions: string[]; loaded: Map<string, RowNode<T>>[] }
        )[];
      }
    | { kind: "leafs"; selected: RowLeaf<T>[] }
    | { kind: "isolated"; selected: RowNode<T>[] };
}

export interface UseServerDataSourceParams<K extends unknown[], S extends unknown[]> {
  readonly queryFn: (params: QueryFnParams<K>) => Promise<(DataResponse | DataResponsePinned)[]>;
  readonly queryKey: K;
  readonly blockSize?: number;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelectKey?: S;
}

export function useServerDataSource<T, K extends unknown[] = unknown[], S extends unknown[] = unknown[]>(
  props: UseServerDataSourceParams<K, S>,
): RowSourceServer<T> {
  const isolatedSelected = props.rowsIsolatedSelection ?? true;
  const s = useSourceState(props, isolatedSelected);

  const isLoading$ = usePiece(s.isLoading);
  const loadError$ = usePiece(s.loadingError);
  const requestsForView$ = usePiece(s.requestsForView, s.setRequestsForView);

  const top$ = usePiece(s.topCount);
  const bot$ = usePiece(s.botCount);
  const maxDepth$ = usePiece(s.maxDepth);
  const rowCount$ = usePiece(s.rowCount);

  const globalSignal = useGlobalRefresh();
  const source = useSource(props, s, globalSignal);

  const rowById = useRowById<T>(source);
  const rowIdToRowIndex = useRowIdToRowIndex<T>(source);
  const rowIndexToRowId = useRowIndexToRowId<T>(source);
  const rowParents = useRowParents<T>(source);
  const rowsBetween = useRowsBetween<T>(source);
  const rowChildren = useRowChildren<T>(source);

  const onViewChange = useOnViewChange(source, s.requestsForView, s.setRequestsForView);

  const onRowsSelected: RowSourceServer<T>["onRowsSelected"] = useEvent(({ mode, selected, deselect }) => {
    // Invalid selection type.
    if ((selected === "all" && mode === "single") || mode === "none") return;

    if (mode === "single") {
      s.setSelected({ kind: "isolated", selected: deselect ? new Set() : new Set([selected[0]]) });
      globalSignal(Date.now());
      return;
    }

    if (selected === "all" && deselect) {
      const next: ServerRowSelection = isolatedSelected
        ? { kind: "isolated", selected: new Set() }
        : { kind: "leafs", selected: new Set() };
      s.setSelected(next);
      globalSignal(Date.now());

      return;
    }

    if (selected === "all") {
      s.setSelected({ kind: "all", exceptions: new Set() });
      globalSignal(Date.now());
      return;
    }

    // At this point we are selecting individual rows. We can handle isolated rows simply enough.
    if (isolatedSelected) {
      s.setSelected((prev) => {
        if (prev.kind === "all") {
          // We go something to do here
          const exceptions = prev.exceptions;
          const next = new Set(exceptions);
          if (deselect) selected.forEach((x) => next.add(x));
          else selected.forEach((x) => next.delete(x));

          return { kind: "all", exceptions: next };
        } else if (prev.kind !== "isolated") {
          return { kind: "isolated", selected: new Set(selected) };
        } else {
          const next = new Set(prev.selected);
          if (deselect) selected.forEach((x) => next.delete(x));
          else selected.forEach((x) => next.add(x));

          return { kind: "isolated", selected: next };
        }
      });
      globalSignal(Date.now());
    }
  });

  const rowIsSelected = useRowIsSelected(source, s);
  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(source, globalSignal, s);

  const setExpansions = s.setExpansions;
  const rowSource = useMemo<RowSourceServer<T>>(() => {
    const rowSource: RowSourceServer<T> = {
      rowById,
      rowByIndex,
      rowInvalidate,
      rowIdToRowIndex,
      rowIndexToRowId,
      rowChildren,

      rowsSelected: () => ({ kind: "leafs", selected: [] }),
      rowIsSelected,

      rowLeafs: () => {
        console.error(
          "The LyteNyte Grid Server Data Source does not support requesting leaf values for a given row.",
        );
        return [];
      },
      rowParents,
      rowsBetween,

      useTopCount: () => top$.useValue(),
      useRowCount: () => rowCount$.useValue(),
      useBottomCount: () => bot$.useValue(),
      useMaxRowGroupDepth: () => maxDepth$.useValue(),

      onRowGroupExpansionChange: (deltaChanges) => {
        setExpansions((prev) => ({ ...prev, ...deltaChanges }));
      },
      onRowsSelected,
      onRowsUpdated: () => {},
      onViewChange,
      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,

      useSnapshotVersion: () => 0,
    };

    return rowSource;
  }, [
    bot$,
    isLoading$,
    loadError$,
    maxDepth$,
    onRowsSelected,
    onViewChange,
    requestsForView$,
    rowById,
    rowByIndex,
    rowChildren,
    rowCount$,
    rowIdToRowIndex,
    rowIndexToRowId,
    rowInvalidate,
    rowIsSelected,
    rowParents,
    rowsBetween,
    setExpansions,
    top$,
  ]);

  return rowSource;
}
