import { useMemo } from "react";
import type { DataRequest, DataResponse, DataResponsePinned, QueryFnParams } from "./types";
import {
  usePiece,
  type Piece,
  useOnRowsSelected,
  useRowIsSelected,
  useRowSelection,
  useRowsSelected,
  useEvent,
  useGlobalRefresh,
  useRowSelectionState,
} from "@1771technologies/lytenyte-core-experimental/internal";
import {
  type RowGroup,
  type RowLeaf,
  type RowNode,
  type RowSelectionState,
  type RowSource,
} from "@1771technologies/lytenyte-shared";
import { useRowByIndex } from "./source/use-row-by-index.js";
import { useRowIndexToRowId } from "./source/use-row-index-to-row-id.js";
import { useRowIdToRowIndex } from "./source/use-row-id-to-row-index.js";
import { useRowById } from "./source/use-row-by-id.js";
import { useOnViewChange } from "./source/use-on-view-change.js";
import { useSourceState } from "./source/use-source-state.js";
import { useSource } from "./source/use-source.js";
import { useRowParents } from "./source/use-row-parents.js";
import { useRowsBetween } from "./source/use-rows-between.js";
import { useRowChildren } from "./source/use-row-children.js";
import { useRowLeafs } from "./source/use-row-leafs.js";
import { useOnRowsUpdated } from "./source/use-on-rows-updated.js";
import { useRowDelete } from "./source/use-row-delete.js";
import { useRowAdd } from "./source/use-row-add.js";

export interface RowSourceServer<T> extends RowSource<T> {
  readonly isLoading: Piece<boolean>;
  readonly loadingError: Piece<unknown>;
  readonly requestsForView: Piece<DataRequest[]>;

  readonly seenRequests: Set<string>;
  readonly retry: () => void;
  readonly requestForGroup: (row: RowGroup | number) => DataRequest | null;
  readonly requestForNextSlice: (currentRequest: DataRequest) => DataRequest | null;
  readonly refresh: (onSuccess?: () => void, onError?: (e: unknown) => void) => void;
  readonly pushResponses: (req: (DataResponse | DataResponsePinned)[]) => void;
  readonly pushRequests: (req: DataRequest[], onSuccess?: () => void, onError?: (e: unknown) => void) => void;
  readonly reset: () => void;

  readonly rowAdd: (rows: RowLeaf<T>[], placement?: "start" | "end") => void;
  readonly rowDelete: (rows: RowNode<T>[]) => void;
  readonly rowUpdate: (rows: Map<RowNode<T>, T>) => void;
}

export interface UseServerDataSourceParams<K extends unknown[], T = any> {
  readonly queryFn: (params: QueryFnParams<K>) => Promise<(DataResponse | DataResponsePinned)[]>;
  readonly queryKey: K;
  readonly blockSize?: number;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelection?: RowSelectionState;
  readonly rowSelectionIdUniverseAdditions?: Set<string>;
  readonly onRowSelectionChange?: (state: RowSelectionState) => void;
  readonly rowSelectKey?: unknown[];

  readonly rowUpdateOptimistically?: boolean;
  readonly onRowDataChange?: (params: { readonly rows: Map<RowNode<T>, T> }) => Promise<void>;
  readonly onRowsDeleted?: (params: { readonly rows: RowNode<T>[] }) => Promise<void>;
  readonly onRowsAdded?: (params: {
    readonly rows: RowLeaf<T>[];
    placement: "start" | "end";
  }) => Promise<void>;
}

export function useServerDataSource<T, K extends unknown[] = unknown[]>(
  props: UseServerDataSourceParams<K>,
): RowSourceServer<T> {
  const isolatedSelected = props.rowsIsolatedSelection ?? false;
  const state = useSourceState(props);

  const isLoading$ = usePiece(state.isLoading);
  const loadError$ = usePiece(state.loadingError);
  const requestsForView$ = usePiece(state.requestsForView, state.setRequestsForView);
  const top$ = usePiece(state.topCount);
  const bot$ = usePiece(state.botCount);
  const maxDepth$ = usePiece(state.maxDepth);
  const rowCount$ = usePiece(state.rowCount);

  const globalSignal = useGlobalRefresh();
  const source = useSource(props, state, globalSignal);

  const rowById = useRowById<T>(source);
  const rowIdToRowIndex = useRowIdToRowIndex<T>(source);
  const rowIndexToRowId = useRowIndexToRowId<T>(source);
  const rowParents = useRowParents<T>(source);
  const rowsBetween = useRowsBetween<T>(source);
  const rowChildren = useRowChildren<T>(source);

  const onViewChange = useOnViewChange(source, state.requestsForView, state.setRequestsForView);

  const idSpec = useEvent((id: string) => {
    const node = source.tree.rowIdToNode.get(id);
    if (!node || node.kind === "leaf") return null;

    return { size: node.size, children: node.byIndex };
  });

  // Handling row selection
  const selectionState = useRowSelection(
    props.rowSelection,
    props.onRowSelectionChange,
    isolatedSelected,
    props.rowSelectKey ?? props.queryKey,
    useMemo(() => {
      if (!props.rowSelectionIdUniverseAdditions) return state.idUniverse;

      return state.idUniverse.union(props.rowSelectionIdUniverseAdditions);
    }, [props.rowSelectionIdUniverseAdditions, state.idUniverse]),
    globalSignal,
  );
  const onRowsSelected = useOnRowsSelected(
    selectionState,
    idSpec,
    rowParents,
    isolatedSelected,
    globalSignal,
  );
  const rowIsSelected = useRowIsSelected<T>(selectionState, rowParents, rowById);
  const rowsSelected = useRowsSelected(selectionState, source.tree.rowIdToNode, rowParents);
  const rowSelectionState = useRowSelectionState(selectionState);

  const rowLeafs = useRowLeafs<T>(source);
  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(source, selectionState, globalSignal, rowParents);
  const setExpansions = state.setExpansions;

  const onRowsUpdated = useOnRowsUpdated(source, props.onRowDataChange, props.rowUpdateOptimistically);

  const row$ = usePiece(state.rows);

  const rowDelete = useRowDelete(source, props.onRowsDeleted, props.rowUpdateOptimistically);

  const rowAdd = useRowAdd(source, props.onRowsAdded, props.rowUpdateOptimistically);

  const selection$ = usePiece(selectionState.rowSelectionsRaw);

  const rowSource = useMemo<RowSourceServer<T>>(() => {
    const rowSource: RowSourceServer<T> = {
      rowById,
      rowByIndex,
      rowInvalidate,
      rowIdToRowIndex,
      rowIndexToRowId,
      rowChildren,
      rowsSelected,
      rowIsSelected,
      rowSelectionState,
      rowDelete,
      rowAdd,
      rowUpdate: onRowsUpdated,

      rowLeafs,
      rowParents,
      rowsBetween,

      useTopCount: () => top$.useValue(),
      useRowCount: () => rowCount$.useValue(),
      useBottomCount: () => bot$.useValue(),
      useRows: () => row$.useValue(),
      useMaxRowGroupDepth: () => maxDepth$.useValue(),
      useSelectionState: selection$.useValue,

      onRowGroupExpansionChange: (deltaChanges) => {
        setExpansions((prev) => ({ ...prev, ...deltaChanges }));
      },
      onRowsSelected,
      onViewChange,

      onRowsUpdated,

      // Specific to the server data source
      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,

      pushRequests: (requests) => source.handleRequests(requests),
      pushResponses: source.handleResponses,
      retry: () => {
        source.retry();
        rowSource.rowInvalidate();
      },
      refresh: (onSuccess, onError) => {
        const requests = requestsForView$.get();
        rowSource.pushRequests(requests, onSuccess, onError);
      },
      reset: () => source.reset(),
      requestForGroup: (row) => {
        const index = typeof row === "number" ? row : source.flat.rowIdToRowIndex.get(row.id);
        if (index == null) return null;

        return source.requestForGroup(index);
      },
      requestForNextSlice: (req) => source.requestForNextSlice(req),

      get seenRequests() {
        return source.flat?.seenRequests ?? new Set();
      },
    };

    return rowSource;
  }, [
    bot$,
    isLoading$,
    loadError$,
    maxDepth$,
    onRowsSelected,
    onRowsUpdated,
    onViewChange,
    requestsForView$,
    row$,
    rowAdd,
    rowById,
    rowByIndex,
    rowChildren,
    rowCount$,
    rowDelete,
    rowIdToRowIndex,
    rowIndexToRowId,
    rowInvalidate,
    rowIsSelected,
    rowLeafs,
    rowParents,
    rowSelectionState,
    rowsBetween,
    rowsSelected,
    selection$.useValue,
    setExpansions,
    source,
    top$,
  ]);

  return rowSource;
}
