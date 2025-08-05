import { useEffect, useMemo, useState, type Dispatch, type JSX, type SetStateAction } from "react";
import type { Column, FilterIn, FilterInFilterItem, Grid } from "../+types";
import { useVirtualizedTree } from "../tree-view/virtualized/use-virtualized-tree";
import type { PathRoot } from "@1771technologies/lytenyte-shared";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface UseTreeFilterReturn<T> {
  readonly rootProps: {
    readonly fetchItems: () => void;
    readonly loading: boolean;
    readonly error: any;
    readonly pivotMode: boolean;
    readonly grid: Grid<T>;
    readonly expansions: Record<string, boolean>;
    readonly onExpansionChange: Dispatch<SetStateAction<Record<string, boolean>>>;
    readonly treeRef: (el: HTMLElement | null) => void;
    readonly getAllIds: () => Set<string>;
    readonly getIdsBetweenNodes: (left: HTMLElement, right: HTMLElement) => string[];
    readonly onFocusChange: (el: HTMLElement | null) => void;
    readonly root: PathRoot<FilterInFilterItem>;
    readonly filterIn: FilterIn;
    readonly columnId: string;
    readonly items: FilterInFilterItem[];
  };

  readonly tree: TreeVirtualItem<FilterInFilterItem>[];
  readonly spacer: JSX.Element;
}

export interface UseFilterTreeArgs<T> {
  grid: Grid<T>;
  column: Column<T>;
  treeItemHeight?: number;
  pivotMode?: boolean;
}

export function useFilterTree<T>({
  grid,
  column,
  treeItemHeight = 24,
  pivotMode,
}: UseFilterTreeArgs<T>) {
  const [items, setItems] = useState<FilterInFilterItem[]>([]);
  const [expansions, onExpansionChange] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const rds = grid.state.rowDataSource.useValue();

  const filterModel = grid.state.filterInModel.useValue();
  const pivotModel = grid.state.columnPivotModel.useValue().filtersIn;

  const currentPivotMode = grid.state.columnPivotMode.useValue();

  const model = (pivotMode ?? currentPivotMode) ? pivotModel : filterModel;

  const existingFilter = useMemo(() => {
    const filter = model[column.id];
    return filter ?? { kind: "in", operator: "not_in", value: new Set() };
  }, [column.id, model]);

  const fetchItems = useEvent(() => {
    const items = rds.inFilterItems(column);
    if ("then" in items) {
      setLoading(true);
      items
        .then((res) => {
          setItems(res);
          setError(null);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    } else {
      setItems(items);
      setError(null);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchItems();
  }, [column, fetchItems, rds]);

  const itemsWithSelectAll = useMemo<FilterInFilterItem[]>(() => {
    return [{ id: "__LNG__SELECT_ALL", label: "(Select All)", value: "" }, ...items];
  }, [items]);

  const virt = useVirtualizedTree({
    itemHeight: treeItemHeight,
    paths: itemsWithSelectAll,
    expansions,
    expansionDefault: true,
    nonAdjacentPathTrees: false,
  });

  return {
    rootProps: {
      fetchItems,
      items,
      grid,
      columnId: column.id,
      expansions,
      pivotMode: pivotMode ?? currentPivotMode,
      onExpansionChange,
      treeRef: virt.ref,
      loading,
      error,
      filterIn: existingFilter ?? null,
      ...virt.rootProps,
    },
    spacer: virt.spacer,
    tree: virt.virtualTree,
  } satisfies UseTreeFilterReturn<T>;
}
