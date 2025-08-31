import { createContext, useContext } from "react";
import type { Grid } from "./+types";
import type { InternalAtoms } from "./state/+types";

export interface GridRootContext {
  readonly ref: (el: HTMLElement | null) => void;
  readonly grid: Grid<any> & { internal: InternalAtoms };
}

const context = createContext<GridRootContext>(null as any);

export const RootProvider = context.Provider;
export const useGridRoot = () => useContext(context);
