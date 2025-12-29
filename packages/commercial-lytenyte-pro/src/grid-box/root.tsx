import { useMemo, type PropsWithChildren } from "react";
import { Root } from "../listbox/root.js";
import type { DropEventParams, Grid } from "../+types.js";
import { GridProvider } from "../grid-provider/provider.js";
import { GridBoxContext } from "./context.js";

export interface GridBoxRootProps<T> {
  readonly orientation?: "vertical" | "horizontal";
  readonly onRootDrop: (p: DropEventParams) => void;
  readonly accepted: string[];
  readonly grid: Grid<T>;
}

export function GridBoxRoot<T>({
  grid,
  orientation = "vertical",
  accepted,
  onRootDrop,
  children,
}: PropsWithChildren<GridBoxRootProps<T>>) {
  return (
    <GridProvider value={grid as any}>
      <GridBoxContext.Provider
        value={useMemo(() => ({ accepted, orientation, onRootDrop }), [accepted, onRootDrop, orientation])}
      >
        <Root orientation={orientation}>{children}</Root>
      </GridBoxContext.Provider>
    </GridProvider>
  );
}
