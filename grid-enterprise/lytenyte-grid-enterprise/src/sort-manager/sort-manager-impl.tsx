import "./sort-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { type PropsWithChildren } from "react";
import { GridProvider } from "../use-grid";
import { SortManagerContainer } from "./sort-manager-container";
import { SortColumnSelect } from "./sort-column-select";
import { SortSelect } from "./sort-sort-select";
import { SortDirectionSelection } from "./sort-direction-select";
import { SortAdder } from "./sort-adder";
import { SortRemover } from "./sort-remove";
import { useSortState } from "./use-sort-state";
import { SortManagerContext } from "./sort-manager-context";
import { SortApply } from "./sort-apply";
import { SortCancel } from "./sort-cancel";

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

  SortApply: SortApply,
  SortCancel: SortCancel,
};
