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
import { LngTooltip } from "../tooltip/lng-tooltip";

export interface SortDeleteComponentProps {
  onDelete: () => void;
  disabled: boolean;
  disableReason: string;
}

export interface SortAddComponentProps {
  onAdd: () => void;
  disabled: boolean;
  disableReason: string;
}

export interface SortManagerConfiguration {
  readonly columnSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortDirectionComponent?: (s: SelectProps) => ReactNode;
  readonly sortDeleteComponent?: (s: SortDeleteComponentProps) => ReactNode;
  readonly sortAddComponent?: (s: SortAddComponentProps) => ReactNode;

  readonly localization?: {
    readonly title: string;
    readonly labelSortByColumn: string;
    readonly labelSortOn: string;
    readonly labelOrder: string;
    readonly labelApply: string;
    readonly labelCancel: string;

    readonly placeholderColumnSelect: string;
    readonly placeholderSort: string;
    readonly placeholderOrder: string;

    readonly disabledNoMoreSortableColumns: string;
    readonly disabledLastItem: string;
  };

  readonly axe?: {
    readonly ar: string;
  };
}

export interface SortManagerProps<D> {
  readonly grid: StoreEnterpriseReact<D>;

  readonly onCancel?: () => void;
  readonly onApply?: () => void;
  readonly onAdd?: () => void;
  readonly onDelete?: () => void;
}

export function SortManager<D>({ grid, onCancel, onApply, onAdd, onDelete }: SortManagerProps<D>) {
  const config = cc.sortManager.use();
  const Select = config.columnSelectComponent ?? DefaultSelect;
  const Delete = config.sortDeleteComponent ?? DefaultDelete;
  const Add = config.sortAddComponent ?? DefaultAdd;

  const localization = config.localization! ?? {};

  const [columnItems, columnValues] = useColumnsSelectItems(grid);

  const [state, setState] = useSortState(grid);

  return (
    <LngTooltip>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={css`
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        `}
      >
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
            <div className={"lng1771-text-small-700"}>{localization.labelSortByColumn}</div>
            <div className={"lng1771-text-small-700"}>{localization.labelSortOn}</div>
            <div
              className={clsx(
                "lng1771-text-small-700",
                css`
                  grid-column: span 2;
                `,
              )}
            >
              {localization.labelOrder}
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
                  placeholder={localization.placeholderColumnSelect}
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
                  placeholder={localization.placeholderSort}
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
                  placeholder={localization.placeholderOrder}
                />
                <div
                  className={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  <Delete
                    disabled={state.length === 1}
                    disableReason={localization.disabledLastItem}
                    onDelete={() => {
                      setState((prev) => {
                        const next = [...prev];
                        next.splice(i, 1);
                        return next;
                      });
                      onDelete?.();
                    }}
                  />
                  <Add
                    disabled={columnItems.length === 1}
                    disableReason={localization.disabledNoMoreSortableColumns}
                    onAdd={() => {
                      setState((prev) => {
                        const next = [...prev];
                        next.splice(i, 0, { sortDirection: "ascending" });
                        return next;
                      });
                      onAdd?.();
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={css`
            flex: 1;
          `}
        />
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
            {localization.labelCancel}
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              grid.state.sortModel.set(sortItemsToSortModel(state));

              onApply?.();
            }}
          >
            {localization.labelApply}
          </Button>
        </div>
      </form>
    </LngTooltip>
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
