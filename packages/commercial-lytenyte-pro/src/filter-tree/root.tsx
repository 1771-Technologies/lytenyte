import { useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider";
import { TreeRoot } from "../tree-view/root";
import { FilterTreeContext } from "./context";
import type { UseTreeFilterReturn } from "./hooks/use-filter-tree";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export type FilterTreeRootProps<T> = UseTreeFilterReturn<T>["rootProps"] & {
  readonly grid: Grid<T>;

  readonly loadingAs?: SlotComponent;
  readonly errorAs?: SlotComponent<{ error: any; refetch: () => void }>;
};

export function Root<T>({
  grid,
  treeRef,
  filterIn,
  pivotMode,
  columnId,
  children,
  error,
  loading,
  errorAs,
  loadingAs,
  fetchItems,
  items,
  applyChangesImmediately,
  filterInChange,
  ...rootProps
}: PropsWithChildren<FilterTreeRootProps<T>>) {
  const value = useMemo(() => {
    return {
      filter: filterIn,
      filterChange: filterInChange,
      pivotMode,
      columnId,
      items,
      applyChangesImmediately,
    };
  }, [applyChangesImmediately, columnId, filterIn, filterInChange, items, pivotMode]);

  const loadingSlot = useSlot({
    slot: loadingAs ?? <div>Loading...</div>,
  });
  const errorSlot = useSlot({
    slot: errorAs ?? <div>Error Occurred Fetching</div>,
    state: { error, refetch: fetchItems },
  });

  if (loading) return loadingSlot;
  if (error) return errorSlot;

  return (
    <GridProvider value={grid as any}>
      <FilterTreeContext.Provider value={value}>
        <TreeRoot
          selectMode="none"
          transitionEnter={0}
          transitionExit={0}
          expansionDefault
          ref={treeRef}
          {...rootProps}
        >
          {children}
        </TreeRoot>
      </FilterTreeContext.Provider>
    </GridProvider>
  );
}
