import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { type PropsWithChildren } from "react";
import { GridProvider } from "../use-grid";
import { SortManagerContainer } from "./sort-manager-container";
import { SortColumnSelect } from "./sort-column-select";

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

  ColumnSelect: SortColumnSelect,
};
