import {
  RootProvider as CoreProvider,
  useGridRoot as useCoreRoot,
} from "@1771technologies/lytenyte-core/yinternal";
import type { Grid } from "./+types.js";
import type { InternalAtoms } from "./state/+types.js";
import type { Provider } from "react";

export interface GridRootContext {
  readonly ref: (el: HTMLElement | null) => void;
  readonly grid: Grid<any> & { internal: InternalAtoms };
}

// The PRO context is a superset of the Core context, but we still want to leverage some of the core
// components to share code. Hence we share the context functionality.
export const RootProvider = CoreProvider as unknown as Provider<GridRootContext>;
export const useGridRoot = useCoreRoot as unknown as () => GridRootContext;
