import "./filter-container.css";

import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";
import { useSimpleFilters } from "./use-simple-filters";
import { useInFilter as useInFilter } from "./use-in-filter";
import { SimpleFilter } from "../simple-filter/simple-filter";
import { flatToCombined } from "./flat-to-combined";
import { InFilter } from "../in-filter/in-filter";
import { Button } from "../../../components-internal/button/button";

export interface FilterContainerProps<D> {
  readonly api: ApiEnterpriseReact<D>;
  readonly column: ColumnEnterpriseReact<D>;
  readonly showConditionalWhenFilterValid?: boolean;
  readonly showSimpleFilters?: boolean;

  readonly getTreeFilterItems?: (
    api: ApiEnterpriseReact<D>,
    column: ColumnEnterpriseReact<D>,
  ) => Promise<ColumnInFilterItem[]> | ColumnInFilterItem[];

  readonly onCancel?: () => void;
  readonly onClearFilters?: () => void;
  readonly onApplyFilters?: () => void;

  readonly treeViewportHeight?: number;
  readonly showInFilter?: boolean;
}
export function FilterContainer<D>({
  api,
  column,
  showConditionalWhenFilterValid = true,
  showSimpleFilters = true,

  getTreeFilterItems,
  onApplyFilters,
  onCancel,
  onClearFilters,

  treeViewportHeight = 300,
  showInFilter = false,
}: FilterContainerProps<D>) {
  const { flatFilters, onFilterChange, filters, isPivot } = useSimpleFilters(
    api,
    column,
    showConditionalWhenFilterValid,
  );

  const { values, setValues } = useInFilter(api, column);

  return (
    <div className="lng1771-filter">
      {/* Simple Filter and In Filter */}
      <div className="lng1771-filter__container">
        {showSimpleFilters && (
          <SimpleFilter filters={flatFilters} onFiltersChange={onFilterChange} />
        )}
        {showInFilter && (
          <InFilter
            getTreeFilterItems={getTreeFilterItems}
            api={api}
            column={column}
            errorLabel="Failed to get filter items"
            noItemsLabel="No filter items available"
            values={values}
            onValuesChange={setValues}
            treeViewportHeight={treeViewportHeight}
          />
        )}
      </div>

      {/* Filter Controls */}
      <div className="lng1771-filter__controls">
        <div style={{ flex: 1 }}>
          <Button kind="secondary" onClick={() => onCancel?.()}>
            Cancel
          </Button>
        </div>
        <Button
          kind="tertiary"
          onClick={() => {
            const newFilters = { ...filters };
            delete newFilters[column.id];

            if (isPivot) {
              api.columnPivotSetFilterModel(newFilters);
            } else {
              api.getState().filterModel.set(newFilters);
            }

            onClearFilters?.();
          }}
        >
          Clear
        </Button>
        <Button
          kind="primary"
          onClick={() => {
            const combined = flatToCombined<D>(flatFilters);
            const newFilters = { ...filters };

            if (showSimpleFilters) {
              newFilters[column.id] ??= {};
              newFilters[column.id].simple = combined;
            }

            if (showInFilter) {
              newFilters[column.id] ??= {};
              newFilters[column.id].set = values?.size
                ? {
                    columnId: column.id,
                    kind: "in",
                    operator: "notin",
                    set: values,
                  }
                : null;
            }

            if (isPivot) {
              api.columnPivotSetFilterModel(newFilters);
            } else {
              api.getState().filterModel.set(newFilters);
            }
            onApplyFilters?.();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
