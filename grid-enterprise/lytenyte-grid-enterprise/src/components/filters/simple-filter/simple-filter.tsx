import type { FilterSimpleColumn } from "@1771technologies/grid-types/community";
import { Fragment } from "react/jsx-runtime";
import { LogicalSwitch } from "./logical-switch";
import { t } from "@1771technologies/grid-design";
import { HandleDateFilter } from "./date-filter/handle-date-filter";
import { HandleNumberFilter } from "./number-filter/handle-number-filter";
import { HandleTextFilter } from "./text-filter/handle-text-filter";

export type SemiPartialFilter = Partial<FilterSimpleColumn> & {
  kind: FilterSimpleColumn["kind"];
  columnId: FilterSimpleColumn["columnId"];
};

export interface SimpleFilterItemProps {
  readonly value: SemiPartialFilter;
  readonly onFilterChange: (v: SemiPartialFilter) => void;
}

export type FlatSimpleFilters = [SemiPartialFilter, "or" | "and" | null][];

export interface SimpleFilterProps {
  readonly filters: FlatSimpleFilters;
  readonly onFiltersChange: (v: FlatSimpleFilters) => void;
  readonly noChoiceLabel?: string;
}

export function SimpleFilter(p: SimpleFilterProps) {
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 1fr;
        width: 100%;
        gap: ${t.spacing.space_30};

        @container (min-width: 380px) {
          grid-template-columns: 1fr 1fr;
          gap: var(--lng1771-space-30);
        }
      `}
    >
      <div className={labelCss}>Operator</div>
      <div className={labelCss}>Values</div>
      {p.filters.map(([value, logical], i) => {
        const onChange = (filter: SemiPartialFilter) => {
          const next = [...p.filters];
          next[i] = [filter, logical];

          p.onFiltersChange(next);
        };
        const onCheckChange = (c: "and" | "or") => {
          const next = [...p.filters];
          next[i] = [next[i][0], c];

          p.onFiltersChange(next);
        };

        return (
          <Fragment key={i}>
            <SimpleFilterImpl value={value} onFilterChange={onChange} />
            {logical !== null && <LogicalSwitch onChange={onCheckChange} value={logical} />}
          </Fragment>
        );
      })}
    </div>
  );
}

export function SimpleFilterImpl(p: SimpleFilterItemProps) {
  const kind = p.value.kind;

  if (kind === "date") {
    return <HandleDateFilter {...p} />;
  }

  if (kind === "number") {
    return <HandleNumberFilter {...p} />;
  }

  if (kind === "text") {
    return <HandleTextFilter {...p} />;
  }

  return null;
}

const labelCss = css`
  font-size: ${t.typography.body_m};
  font-family: ${t.typography.typeface_body};
  padding-inline: ${t.spacing.space_20};
  color: ${t.colors.gray_60};
  font-weight: 500;
  display: none;

  @container (min-width: 380px) {
    display: block;
  }
`;
