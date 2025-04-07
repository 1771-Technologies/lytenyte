import "./filter-manager.css";
import { useMemo, type PropsWithChildren } from "react";
import { GridProvider } from "../use-grid";
import { useSimpleFilters } from "./use-simple-filters";
import { FilterManagerStateProvider } from "./filter-state-context";
import { useInFilter } from "./use-in-filter";
import { SimpleFilterRoot } from "./components/simple-filter-root";
import { SimpleFilterOperator } from "./components/simple-filter-operator/simple-filter-operator";
import { SimpleFilterValue } from "./components/simple-filter-value/simple-filter-value";
import { SimpleFilterAdditionalSwitch } from "./components/simple-filter-additional-switch";
import { FilterManagerApplyButton } from "./components/apply-filter-button";
import { FilterManagerClearButton } from "./components/clear-filter-button";
import { InFilterRoot } from "./components/in-filter-root";
import { InFilterError } from "./components/in-filter-error";
import { InFilterLoading } from "./components/in-filter-loading";
import { InFilterViewport } from "./components/in-filter-tree";
import { InFilterContainer } from "./components/in-filter-container";
import type { ColumnProReact, GridProReact } from "../types";

interface FilterManagerRootProps<D = any> {
  readonly grid: GridProReact<D>;
  readonly column: ColumnProReact<D>;
}

function Root<D>({ grid, column, children }: PropsWithChildren<FilterManagerRootProps<D>>) {
  const simpleState = useSimpleFilters(grid.api, column, true);
  const inFilterState = useInFilter(grid.api, column);

  return (
    <GridProvider value={grid}>
      <FilterManagerStateProvider
        value={useMemo(
          () => ({
            ...simpleState,
            column,
            inFilterValue: inFilterState.values,
            setInFilterValue: inFilterState.setValues,
          }),
          [column, inFilterState.setValues, inFilterState.values, simpleState],
        )}
      >
        {children}
      </FilterManagerStateProvider>
    </GridProvider>
  );
}

export const FilterManager = {
  Root,
  SimpleRoot: SimpleFilterRoot,
  SimpleOperator: SimpleFilterOperator,
  SimpleValue: SimpleFilterValue,
  SimpleSwitch: SimpleFilterAdditionalSwitch,

  InFilterRoot: InFilterRoot,
  InFilterContainer,
  InFilterError: InFilterError,
  InFilterLoading: InFilterLoading,
  InFilterViewport,

  ApplyButton: FilterManagerApplyButton,
  ClearButton: FilterManagerClearButton,
};
