import { useMemo, type PropsWithChildren } from "react";
import type { Column, Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider";
import { TreeRoot } from "../tree-view/root";
import type { UseColumnManagerReturn } from "./use-column-manager";
import type { PathBranch, PathRoot } from "@1771technologies/lytenyte-shared";
import { branchLookupContext } from "./branch-lookup-context";

export type ColumnManagerRootProps<T> = UseColumnManagerReturn<T>["rootProps"] & {
  readonly grid: Grid<T>;
  readonly root: PathRoot<Column<any>>;
};

export function Root<T>({
  grid,
  children,
  treeRef,
  root,
  ...rootProps
}: PropsWithChildren<ColumnManagerRootProps<T>>) {
  const branchLookup = useMemo(() => {
    const stack = [...root.children.values()];
    const lookup: Record<string, PathBranch<Column<any>>> = {};
    while (stack.length) {
      const item = stack.pop()!;
      if (item.kind === "leaf") continue;

      lookup[item.data.idOccurrence] = item;
      stack.push(...item.children.values());
    }

    return lookup;
  }, [root.children]);

  return (
    <branchLookupContext.Provider value={branchLookup}>
      <GridProvider value={grid as any}>
        <TreeRoot
          selectMode="multiple"
          transitionEnter={200}
          transitionExit={200}
          expansionDefault
          ref={treeRef}
          {...rootProps}
        >
          {children}
        </TreeRoot>
      </GridProvider>
    </branchLookupContext.Provider>
  );
}
