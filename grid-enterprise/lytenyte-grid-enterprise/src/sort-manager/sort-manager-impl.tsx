import "./sort-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
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

interface SortManagerRootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
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

  SortApply: SortApplyButton,
  SortCancel: SortCancelButton,
  SortClear: SortClearButton,
};
