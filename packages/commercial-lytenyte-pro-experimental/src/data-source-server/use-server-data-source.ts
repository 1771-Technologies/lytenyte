import { useMemo } from "react";
import type { DataRequest, DataResponse, DataResponsePinned, QueryFnParams } from "./types";
import { usePiece, type Piece } from "@1771technologies/lytenyte-core-experimental/internal";
import { type RowNode, type RowSelectionState, type RowSource } from "@1771technologies/lytenyte-shared";
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
import { useOnRowsSelected } from "./source/on-rows-selected/use-on-rows-selected.js";
import { useRowsSelected } from "./source/use-rows-selected.js";
import { useRowLeafs } from "./source/use-row-leafs.js";

export interface RowSourceServer<T> extends RowSource<T> {
  readonly isLoading: Piece<boolean>;
  readonly loadingError: Piece<unknown>;
  readonly requestsForView: Piece<DataRequest[]>;

  readonly rowsSelected: () => { state: RowSelectionState; loadedNodesSelected: RowNode<T>[] };
}

export interface UseServerDataSourceParams<K extends unknown[], S extends unknown[]> {
  readonly queryFn: (params: QueryFnParams<K>) => Promise<(DataResponse | DataResponsePinned)[]>;
  readonly queryKey: K;
  readonly blockSize?: number;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly rowSelection?: RowSelectionState;
  readonly onRowSelectionChange?: (state: RowSelectionState) => void;

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
  const onRowsSelected = useOnRowsSelected(source, s, rowParents, isolatedSelected, globalSignal);

  const rowIsSelected = useRowIsSelected<T>(source, s, rowParents);
  const rowsSelected = useRowsSelected<T>(source, s, rowParents);
  const rowLeafs = useRowLeafs<T>(source);
  const { rowByIndex, rowInvalidate } = useRowByIndex<T>(source, globalSignal, s, rowParents);

  const setExpansions = s.setExpansions;

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

      rowLeafs,
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
      onViewChange,
      isLoading: isLoading$,
      loadingError: loadError$,
      requestsForView: requestsForView$,

      onRowsUpdated: () => {},
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
    rowLeafs,
    rowParents,
    rowsBetween,
    rowsSelected,
    setExpansions,
    top$,
  ]);

  return rowSource;
}
