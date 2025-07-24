import { type PropsWithChildren } from "react";
import type { Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider";
import { TreeRoot } from "../tree-view/root";
import type { UseColumnManagerReturn } from "./use-column-manager";

export type ColumnManagerRootProps<T> = UseColumnManagerReturn<T>["rootProps"] & {
  readonly grid: Grid<T>;
};

export function Root<T>({
  grid,
  children,
  treeRef,
  ...rootProps
}: PropsWithChildren<ColumnManagerRootProps<T>>) {
  return (
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
  );
}
