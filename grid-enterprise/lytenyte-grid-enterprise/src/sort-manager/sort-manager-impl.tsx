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

interface SortManagerRootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
}

function SortManagerRoot<D>(props: PropsWithChildren<SortManagerRootProps<D>>) {
  return <GridProvider value={props.grid}>{props.children}</GridProvider>;
}

/**
 * ColumnSortRow
 *   - Column
 *   - Sort On
 *   - Order
 *   - Add
 *   - Remove
 * Cancel
 * Apply
 */

export const SortManager = {
  Root: SortManagerRoot,
  Container: SortManagerContainer,

  SortColumnSelect: SortColumnSelect,
  SortSelect: SortSelect,
  SortDirectionSelect: SortDirectionSelection,
  SortAdder: SortAdder,
  SortRemove: SortRemover,
};
