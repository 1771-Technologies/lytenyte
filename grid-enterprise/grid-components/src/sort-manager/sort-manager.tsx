import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Select as DefaultSelect, type SelectProps } from "../select/select";
import { type ReactNode } from "react";
import { cc } from "../component-configuration";
import { clsx } from "@1771technologies/js-utils";
import { Separator } from "../separator/separator";
import { t } from "@1771technologies/grid-design";
import { useColumnsSelectItems } from "./use-column-select-items";
import { DefaultDelete } from "./delete-component";
import { Button } from "../buttons/button";

export interface SortManagerConfiguration {
  readonly columnSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortDirectionComponent?: (s: SelectProps) => ReactNode;
  readonly sortDeleteComponent?: () => ReactNode;

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

  readonly icons?: {
    readonly checked?: () => ReactNode;
    readonly dropdown?: () => ReactNode;
    readonly delete?: () => ReactNode;
  };
}

export interface SortManagerProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function SortManager<D>({ grid }: SortManagerProps<D>) {
  const config = cc.sortManager.use();

  const columnItems = useColumnsSelectItems(grid);

  const Select = config.columnSelectComponent ?? DefaultSelect;
  const Delete = config.sortDeleteComponent ?? DefaultDelete;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div
        className={css`
          display: grid;
          grid-template-columns: 2fr 210px 1fr 36px;
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
        <div
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
            onSelect={() => {}}
            value={null}
            placeholder={config.localization.placeholderColumnSelect}
          />
          <Select
            items={sortValuesValues}
            value={null}
            onSelect={() => {}}
            placeholder={config.localization.placeholderSort}
          />
          <Select
            items={sortDirectionValues}
            value={null}
            onSelect={() => {}}
            placeholder={config.localization.placeholderOrder}
          />
          <div
            className={css`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <Delete />
          </div>
        </div>
      </div>

      <Separator soft dir="horizontal" />
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${t.spacing.space_40};
        `}
      >
        <Button kind="secondary">{config.localization.labelCancel}</Button>
        <Button kind="primary">{config.localization.labelApply}</Button>
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
