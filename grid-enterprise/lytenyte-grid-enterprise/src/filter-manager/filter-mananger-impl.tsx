/**
 * <Root> (Done)
 *  <SimpleFilterRoot>
 *      <SimpleFilterOperator/>
 *      <SimpleFilterValue/>
 *      <SimpleFilterLabel />
 *      <SimpleFilterAdditional>
 *          <LogicalSwitch />
 *
 *       <SimpleFilterOperator/>
 *      <SimpleFilterValue/>
 *      <SimpleFilterLabel />
 *
 *
 *      </SimpleFilterAdditional>
 *  </SimpleFilterRoot>
 *  <InFilter>
 *      <InFilterSearch />
 *      <InFilterContainer
 *          loadingContent={<div></div>}
 *          emptyContent={<div></div>}
 *          errorContent={<div><InFilterRetry/></div>}
 *       >
 *          <InFilterTree>
 *             {c => {
 *              <InFilterItem c={c} />
 *              }}
 *          </InFilterTree>
 *
 *      </InFilterContainer>
 *  </InFilter>
 *
 * </Root>
 */

import type { ColumnEnterpriseReact, StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useMemo, type PropsWithChildren } from "react";
import { GridProvider } from "../use-grid";
import { useSimpleFilters } from "./use-simple-filters";
import { FilterManagerStateProvider } from "./filter-state-context";
import { useInFilter } from "./use-in-filter";
import { SimpleFilterRoot } from "./components/simple-filter-root";
import { SimpleFilterOperator } from "./components/simple-filter-operator/simple-filter-operator";

interface FilterManagerRootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
  readonly column: ColumnEnterpriseReact<D>;
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
};
