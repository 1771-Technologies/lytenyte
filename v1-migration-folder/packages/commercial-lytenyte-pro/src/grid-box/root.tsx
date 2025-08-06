import { useMemo, type PropsWithChildren } from "react";
import { Root } from "../listbox/root";
import type { Grid } from "../+types";
import { GridProvider } from "../grid-provider/provider";
import { GridBoxContext } from "./context";

export interface GridBoxRootProps<T> {
  readonly orientation?: "vertical" | "horizontal";
  readonly accepted: string[];
  readonly grid: Grid<T>;
}

export function GridBoxRoot<T>({
  grid,
  orientation = "vertical",
  accepted,
  children,
}: PropsWithChildren<GridBoxRootProps<T>>) {
  return (
    <GridProvider value={grid as any}>
      <GridBoxContext.Provider
        value={useMemo(() => ({ accepted, orientation }), [accepted, orientation])}
      >
        <Root orientation={orientation}>{children}</Root>
      </GridBoxContext.Provider>
    </GridProvider>
  );
}
