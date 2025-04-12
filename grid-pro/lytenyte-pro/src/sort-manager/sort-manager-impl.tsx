import "./sort-manager.css";
import { type PropsWithChildren } from "react";
import { GridProvider } from "../use-grid.js";
import { SortManagerContainer } from "./sort-manager-container.js";
import { SortColumnSelect } from "./sort-column-select.js";
import { SortSelect } from "./sort-sort-select.js";
import { SortDirectionSelection } from "./sort-direction-select.js";
import { SortAdder } from "./sort-adder.js";
import { SortRemover } from "./sort-remove.js";
import { useSortState } from "./use-sort-state.js";
import { SortManagerContext } from "./sort-manager-context.js";
import { SortApplyButton } from "./sort-apply.js";
import { SortCancelButton } from "./sort-cancel.js";
import { SortClearButton } from "./sort-clear.js";
import type { GridProReact } from "../types";
import { Separator } from "../components-internal/separator/separator";

interface SortManagerRootProps<D = any> {
  readonly grid: GridProReact<D>;
}

function SortManagerRoot<D>({ grid, children }: PropsWithChildren<SortManagerRootProps<D>>) {
  const state = useSortState(grid);

  return (
    <GridProvider value={grid}>
      <SortManagerContext.Provider value={state}>{children}</SortManagerContext.Provider>
    </GridProvider>
  );
}

export const SortManager = {
  Root: SortManagerRoot,
  Container: SortManagerContainer,

  SortColumnSelect: SortColumnSelect,
  SortSelect: SortSelect,
  SortDirectionSelect: SortDirectionSelection,
  SortAdder: SortAdder,
  SortRemove: SortRemover,
  Separator,

  SortApply: SortApplyButton,
  SortCancel: SortCancelButton,
  SortClear: SortClearButton,
};
