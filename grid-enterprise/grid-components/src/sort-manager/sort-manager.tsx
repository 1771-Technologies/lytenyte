import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Select as DefaultSelect, type SelectProps } from "../select/select";
import { type ReactNode } from "react";
import { cc } from "../component-configuration";
import { clsx } from "@1771technologies/js-utils";
import { Separator } from "../separator/separator";
import { t } from "@1771technologies/grid-design";
import { useColumnsSelectItems } from "./use-column-select-items";
import { DefaultAdd, DefaultDelete } from "./components";
import { Button } from "../buttons/button";
import { useSortState, type SortItem } from "./use-sort-state";
import { sortModelToSortItems } from "./sort-model-to-sort-items";
import { sortItemsToSortModel } from "./sort-items-to-sort-model";

export interface SortManagerConfiguration {
  readonly columnSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortDirectionComponent?: (s: SelectProps) => ReactNode;
  readonly sortDeleteComponent?: (s: { onDelete: () => void }) => ReactNode;
  readonly sortAddComponent?: (s: { onAdd: () => void }) => ReactNode;

  readonly localization: {
    readonly title: string;
    readonly labelSortByColumn: string;
    readonly labelSortOn: string;
    readonly labelOrder: string;
    readonly labelApply: string;
    readonly labelCancel: string;

    readonly placeholderColumnSelect: string;
    readonly placeholderSort: string;
    readonly placeholderOrder: string;
  };

  readonly axe?: {
    readonly ar: string;
  };
}

export interface SortManagerProps<D> {
  readonly grid: StoreEnterpriseReact<D>;

  readonly onCancel?: () => void;
  readonly onApply?: () => void;
}

export function SortManager<D>({ grid, onCancel, onApply }: SortManagerProps<D>) {
  const config = cc.sortManager.use();
  const Select = config.columnSelectComponent ?? DefaultSelect;
  const Delete = config.sortDeleteComponent ?? DefaultDelete;
  const Add = config.sortAddComponent ?? DefaultAdd;

  const [columnItems, columnValues] = useColumnsSelectItems(grid);

  const [state, setState] = useSortState(grid);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div
        className={css`
          display: grid;
          grid-template-columns: 2fr 210px 1fr 48px;
          grid-column-gap: ${t.spacing.space_10};
          padding-block: ${t.spacing.space_30};
          padding-inline-start: ${t.spacing.space_50};
          padding-inline-end: ${t.spacing.space_30};
          box-sizing: border-box;
        `}
      >
        {/*  LABEL SECTION    */}
        <div
          className={css`
            display: grid;
            grid-template-columns: subgrid;
            grid-column: -1 /1;
            padding-block-end: ${t.spacing.space_05};
          `}
        >
          <div className={"lng1771-text-small-700"}>{config.localization.labelSortByColumn}</div>
          <div className={"lng1771-text-small-700"}>{config.localization.labelSortOn}</div>
          <div
            className={clsx(
              "lng1771-text-small-700",
              css`
                grid-column: span 2;
              `,
            )}
          >
            {config.localization.labelOrder}
          </div>
        </div>

        {/* SORT SECTION */}
        {state.map((c, i) => {
          return (
            <div
              key={i}
              className={css`
                display: grid;
                grid-template-columns: subgrid;
                grid-column: -1/1;
                padding-block: ${t.spacing.space_10};
                align-items: center;
              `}
            >
              <Select
                items={columnItems}
                onSelect={(column) => {
                  setState((prev) => {
                    const v = { ...prev[i] };
                    v.columnId = column.value;
                    const next = [...prev];
                    next.splice(i, 1, v);

                    return next;
                  });
                }}
                value={columnValues[c.columnId ?? ""] ?? null}
                placeholder={config.localization.placeholderColumnSelect}
              />
              <Select
                items={sortValuesValues}
                value={sortValuesValues.find((v) => v.value === c.sortOn) ?? null}
                onSelect={(sortOn) => {
                  setState((prev) => {
                    const v = { ...prev[i] };
                    v.sortOn = sortOn.value as SortItem["sortOn"];
                    const next = [...prev];
                    next.splice(i, 1, v);

                    return next;
                  });
                }}
                placeholder={config.localization.placeholderSort}
              />
              <Select
                items={sortDirectionValues}
                onSelect={(item) => {
                  setState((prev) => {
                    const v = { ...prev[i] };
                    v.sortDirection = item.value as SortItem["sortDirection"];
                    const next = [...prev];
                    next.splice(i, 1, v);

                    return next;
                  });
                }}
                value={
                  c.sortDirection === "ascending"
                    ? { label: "Asc", value: "ascending" }
                    : { label: "Desc", value: "descending" }
                }
                placeholder={config.localization.placeholderOrder}
              />
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <Delete
                  onDelete={() => {
                    setState((prev) => {
                      const next = [...prev];
                      next.splice(i, 1);
                      return next;
                    });
                  }}
                />
                <Add
                  onAdd={() => {
                    setState((prev) => {
                      const next = [...prev];
                      next.splice(i, 0, { sortDirection: "ascending" });
                      return next;
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Separator soft dir="horizontal" />
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${t.spacing.space_40} calc(${t.spacing.space_40} + ${t.spacing.space_05});
        `}
      >
        <Button
          kind="secondary"
          onClick={() => {
            setState(sortModelToSortItems(grid.state.sortModel.peek(), grid));

            onCancel?.();
          }}
        >
          {config.localization.labelCancel}
        </Button>
        <Button
          kind="primary"
          onClick={() => {
            grid.state.sortModel.set(sortItemsToSortModel(state));

            onApply?.();
          }}
        >
          {config.localization.labelApply}
        </Button>
      </div>
    </form>
  );
}

const sortValuesValues = [
  { label: "Values", value: "values" },
  { label: "Absolute", value: "values_absolute" },
  { label: "Accented", value: "values_accented" },
  { label: "Nulls First", value: "values_nulls_first" },
  { label: "Absolute Nulls First", value: "values_absolute_nulls_first" },
  { label: "Accented Nulls First", value: "values_accented_nulls_first" },
];
const sortDirectionValues = [
  { label: "Asc", value: "ascending" },
  { label: "Desc", value: "descending" },
];
