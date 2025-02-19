import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";
import { useSimpleFilters } from "./use-simple-filters";
import { useInFilter as useInFilter } from "./use-in-filter";
import { SimpleFilter } from "../simple-filter/simple-filter";
import { Button } from "../../buttons/button";
import { flatToCombined } from "./flat-to-combined";
import { t } from "@1771technologies/grid-design";
import { InFilter } from "../in-filter/in-filter";
import { cc } from "../../component-configuration";

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
  const config = cc.filter.use();

  return (
    <div
      className={css`
        container-type: inline-size;
        padding-block-start: ${t.spacing.space_20};
        display: flex;
        flex-direction: column;
        gap: ${t.spacing.space_20};
        height: 100%;
        box-sizing: border-box;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          gap: ${t.spacing.space_20};
          padding-inline: ${t.spacing.space_40};
        `}
      >
        {showSimpleFilters && (
          <SimpleFilter filters={flatFilters} onFiltersChange={onFilterChange} />
        )}
        {showInFilter && (
          <InFilter
            getTreeFilterItems={getTreeFilterItems}
            api={api}
            column={column}
            errorLabel={config.inFilter!.labelLoadError}
            noItemsLabel={config.inFilter!.labelNoItems}
            values={values}
            onValuesChange={setValues}
            treeViewportHeight={treeViewportHeight}
          />
        )}
      </div>
      <div
        className={css`
          display: flex;
          align-items: flex-end;
          gap: ${t.spacing.space_10};
          border-top: 1px solid ${t.colors.borders_separator};
          padding-inline: ${t.spacing.space_20};
          padding-block: ${t.spacing.space_30};
        `}
      >
        <div style={{ flex: 1 }}>
          <Button kind="secondary" onClick={() => onCancel?.()}>
            {config.container?.labelCancel}
          </Button>
        </div>
        <Button
          kind="tertiary"
          style={{ color: "var(--lng1771-system-red-50)" }}
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
          {config.container?.labelClear}
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
          {config.container?.labelApply}
        </Button>
      </div>
    </div>
  );
}
