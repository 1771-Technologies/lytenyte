import { useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider";
import { TreeRoot } from "../tree-view/root";
import { FilterTreeContext } from "./context";
import type { UseTreeFilterReturn } from "./use-filter-tree";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export type FilterTreeRootProps<T> = UseTreeFilterReturn<T>["rootProps"] & {
  readonly grid: Grid<T>;

  readonly slotLoading?: SlotComponent;
  readonly slotError?: SlotComponent<{ error: any; refetch: () => void }>;
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
  slotError,
  slotLoading,
  fetchItems,
  items,
  ...rootProps
}: PropsWithChildren<FilterTreeRootProps<T>>) {
  const value = useMemo(() => {
    return { filter: filterIn, pivotMode, columnId, items };
  }, [columnId, filterIn, items, pivotMode]);

  const loadingSlot = useSlot({
    slot: slotLoading ?? <div>Loading...</div>,
  });
  const errorSlot = useSlot({
    slot: slotError ?? <div>Error Occurred Fetching</div>,
    state: { error, refetch: fetchItems },
  });

  if (loading) return loadingSlot;
  if (error) return errorSlot;

  return (
    <GridProvider value={grid as any}>
      <FilterTreeContext.Provider value={value}>
        <TreeRoot
          selectMode="none"
          transitionEnter={200}
          transitionExit={200}
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
