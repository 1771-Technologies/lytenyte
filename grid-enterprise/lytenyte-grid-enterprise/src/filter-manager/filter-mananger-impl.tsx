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

interface FilterManagerRootProps<D = any> {
  readonly grid: StoreEnterpriseReact<D>;
  readonly column: ColumnEnterpriseReact<D>;
  readonly showAdditionalWhenValid?: boolean;
}

function Root<D>({
  grid,
  column,
  children,
  showAdditionalWhenValid,
}: PropsWithChildren<FilterManagerRootProps<D>>) {
  const simpleState = useSimpleFilters(grid.api, column, showAdditionalWhenValid ?? true);
  const inFilterState = useInFilter(grid.api, column);

  return (
    <GridProvider value={grid}>
      <FilterManagerStateProvider
        value={useMemo(
          () => ({
            ...simpleState,
            inFilterValue: inFilterState.values,
            setInFilterValue: inFilterState.setValues,
          }),
          [inFilterState, simpleState],
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
};
