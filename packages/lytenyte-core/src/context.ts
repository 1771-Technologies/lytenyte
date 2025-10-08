import { createContext, useContext } from "react";
import type { Grid } from "./+types.js";
import type { InternalAtoms } from "./state/+types.js";

export interface GridRootContext {
  readonly ref: (el: HTMLElement | null) => void;
  readonly grid: Grid<any> & { internal: InternalAtoms };
  readonly gridId: string;
}

const context = createContext<GridRootContext>(null as any);

export const RootProvider = context.Provider;
export const useGridRoot = () => useContext(context);
