import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import "./column-filter-manager.css";
import type { ColumnFilter, ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";
import { useSimpleFilters } from "./use-simple-filters";
import { useInFilter as useInFilter } from "./use-in-filter";
import { SimpleFilter } from "../simple-filter/simple-filter";
import { Button } from "../../buttons/button";
import { flatToCombined } from "./flat-to-combined";
import { combinedFilterIsForColumn } from "./combined-filter-is-for-column";
import { IconButton } from "../../buttons/icon-button";
import { TrashIcon } from "../../icons/trash-icon";

export interface ColumnFilterContainer<D> {
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

  readonly cancelLabel?: string;
  readonly applyFiltersLabel?: string;

  readonly treeViewportHeight?: number;
  readonly showTreeFilter?: boolean;
}
export function ColumnFilterManager<D>({
  api,
  column,
  showConditionalWhenFilterValid = true,
  showSimpleFilters = true,

  getTreeFilterItems,
  onApplyFilters,
  onCancel,
  onClearFilters,

  cancelLabel = "Cancel",
  applyFiltersLabel = "Apply Filters",

  treeViewportHeight = 300,
  showTreeFilter = false,
}: ColumnFilterContainer<D>) {
  const { flatFilters, onFilterChange, filters, isPivot } = useSimpleFilters(
    api,
    column,
    showConditionalWhenFilterValid,
  );

  const { values, setValues } = useInFilter(api, column);

  return (
    <div className="lng1771-column-filter-manager-root">
      <div className="lng1771-column-filter-manager-simple-filter">
        {showSimpleFilters && (
          <SimpleFilter filters={flatFilters} onFiltersChange={onFilterChange} />
        )}
        {/* {showTreeFilter && (
          <TreeFilter
            getTreeFilterItems={getTreeFilterItems}
            api={api}
            column={column}
            errorLabel={treeFilterErrorLabel}
            noItemsLabel={treeFilterEmptyLabel}
            values={values}
            onValuesChange={setValues}
            treeViewportHeight={treeViewportHeight}
          />
        )} */}
      </div>
      <div className="lng1771-column-filter-manager-controls">
        <div style={{ flex: 1 }}>
          <Button kind="secondary" onClick={() => onCancel?.()}>
            {cancelLabel}
          </Button>
        </div>
        <IconButton
          kind="ghost"
          small
          style={{ color: "var(--lng1771-system-red-50)" }}
          onClick={() => {
            const index = findInternalFilterIndex(filters, column.id);
            let newFilters = filters;

            if (index !== -1 && showSimpleFilters) {
              newFilters = [...filters];
              newFilters.splice(index, 1);
            }

            if (showTreeFilter) {
              newFilters = newFilters.filter(
                (c) => c.kind !== "in" || (c.kind === "in" && !c.isInternal),
              );
            }

            if (isPivot) {
              api.columnPivotSetFilterModel(newFilters);
            } else {
              api.getState().filterModel.set(newFilters);
            }

            onClearFilters?.();
          }}
        >
          <TrashIcon />
        </IconButton>
        <Button
          kind="primary"
          onClick={() => {
            const combined = flatToCombined<D>(flatFilters);
            const index = findInternalFilterIndex(filters, column.id);
            let newFilters = filters;

            if (showSimpleFilters) {
              newFilters = [...newFilters];
              if (index !== -1) {
                newFilters.splice(index, 1);
              }
              if (combined) newFilters.push(combined);
            }

            if (showTreeFilter) {
              newFilters = newFilters.filter(
                (c) => c.kind !== "in" || (c.kind === "in" && !c.isInternal),
              );
              if (values?.size) {
                newFilters.push({
                  columnId: column.id,
                  kind: "in",
                  set: values,
                  operator: "notin",
                  isInternal: true,
                });
              }
            }

            if (isPivot) {
              api.columnPivotSetFilterModel(newFilters);
            } else {
              api.getState().filterModel.set(newFilters);
            }
            onApplyFilters?.();
          }}
        >
          {applyFiltersLabel}
        </Button>
      </div>
    </div>
  );
}

function findInternalFilterIndex<D>(
  filters: ColumnFilter<ApiEnterpriseReact<D>, D>[],
  columnId: string,
) {
  const filterIndex = filters.findIndex((c) => {
    if (c.kind === "registered" || c.kind === "function") return;

    if (!c.isInternal) return false;
    if (c.kind === "combined") {
      return combinedFilterIsForColumn(c, columnId);
    }

    return c.columnId === columnId;
  });

  return filterIndex;
}
