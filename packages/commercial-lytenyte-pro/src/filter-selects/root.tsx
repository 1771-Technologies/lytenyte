import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { context } from "./context.js";
import type { FilterSelectFlat } from "./use-filter-select";

export interface RootProps {
  readonly root: {
    readonly defaultFilter: FilterSelectFlat;
    readonly filters: FilterSelectFlat[];
    readonly setFilters: Dispatch<SetStateAction<FilterSelectFlat[]>>;

    readonly apply: () => void;
    readonly reset: () => void;
    readonly clear: () => void;
    readonly maxCount: number;
  };
}

export function Root({ root, children }: PropsWithChildren<RootProps>) {
  return <context.Provider value={root}>{children}</context.Provider>;
}
