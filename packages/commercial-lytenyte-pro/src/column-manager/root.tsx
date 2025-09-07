import type { PropsWithChildren } from "react";
import type { Column, Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider.js";
import { TreeRoot } from "../tree-view/root.js";
import { branchLookupContext } from "./branch-lookup-context.js";
import type { PathBranch } from "@1771technologies/lytenyte-shared";

export interface ColumnManagerRootProps<T> {
  readonly grid: Grid<T>;
  readonly lookup: Record<string, PathBranch<Column<any>>>;
}
export function Root<T>({ grid, lookup, children }: PropsWithChildren<ColumnManagerRootProps<T>>) {
  return (
    <branchLookupContext.Provider value={lookup}>
      <GridProvider value={grid as any}>
        <TreeRoot>{children}</TreeRoot>
      </GridProvider>
    </branchLookupContext.Provider>
  );
}
