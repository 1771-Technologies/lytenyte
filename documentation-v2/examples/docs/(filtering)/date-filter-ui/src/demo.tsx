import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  useClientDataSource,
  usePiece,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro";
import { data, type DataItem } from "./data.js";
import { useId, useMemo, useState, type CSSProperties } from "react";
import { Switch } from "radix-ui";
import { Header } from "./filter.jsx";
import { isAfter, isBefore, isEqual, isTomorrow, isToday, isYesterday } from "date-fns";
import {
  isInPeriod,
  isLastMonth,
  isLastQuarter,
  isLastWeek,
  isLastYear,
  isNextMonth,
  isNextQuarter,
  isNextWeek,
  isNextYear,
  isThisMonth,
  isThisQuarter,
  isThisWeek,
  isThisYear,
  isYtd,
  type Period,
} from "./date-utils.js";

export interface GridSpec {
  readonly data: DataItem;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, GridFilter>>;
  };
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "id", name: "Product ID", width: 130 },
  {
    id: "saleDate",
    name: "Sale Date",
    width: 120,
    widthFlex: 1,
    cellRenderer: DateCell,
    headerRenderer: Header,
  },
  { id: "category", name: "Category", widthFlex: 1 },
  { id: "name", name: "Name", widthFlex: 1, width: 160 },
  { id: "quantity", name: "Quantity", widthFlex: 1, type: "number", cellRenderer: NumberCell },
  { id: "price", name: "Price", widthFlex: 1, type: "number", cellRenderer: DollarCell },
  { id: "status", name: "Status", widthFlex: 1 },
  { id: "total", name: "Total", widthFlex: 1, type: "number", cellRenderer: DollarCell },
];

export type FilterDateOperator =
  | "equals"
  | "before"
  | "after"
  | "tomorrow"
  | "today"
  | "yesterday"
  | "next_week"
  | "this_week"
  | "last_week"
  | "next_month"
  | "this_month"
  | "last_month"
  | "next_month"
  | "this_month"
  | "last_month"
  | "next_quarter"
  | "this_quarter"
  | "last_quarter"
  | "next_year"
  | "this_year"
  | "last_year"
  | "year_to_date"
  | "all_dates_in_the_period";

export interface FilterDate {
  readonly operator: FilterDateOperator;
  readonly value: string;
}

export interface GridFilter {
  readonly left: FilterDate;
  readonly right: FilterDate | null;
  readonly operator: "AND" | "OR";
}

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

export default function FilterDemo() {
  const [filter, setFilter] = useState<Record<string, GridFilter>>({});
  const filterModel = usePiece(filter, setFilter);

  const filterFn = useMemo(() => {
    const entries = Object.entries(filter);

    const evaluateDateFilter = (operator: FilterDateOperator, compare: string, value: string) => {
      if (operator === "equals") return isEqual(compare, value);
      if (operator === "after") return isAfter(compare, value);
      if (operator === "before") return isBefore(compare, value);

      if (operator === "tomorrow") return isTomorrow(compare);
      if (operator === "today") return isToday(compare);
      if (operator === "yesterday") return isYesterday(compare);

      if (operator === "next_week") return isNextWeek(compare);
      if (operator === "next_month") return isNextMonth(compare);
      if (operator === "next_quarter") return isNextQuarter(compare);
      if (operator === "next_year") return isNextYear(compare);

      if (operator === "this_week") return isThisWeek(compare);
      if (operator === "this_month") return isThisMonth(compare);
      if (operator === "this_quarter") return isThisQuarter(compare);
      if (operator === "this_year") return isThisYear(compare);

      if (operator === "last_week") return isLastWeek(compare);
      if (operator === "last_month") return isLastMonth(compare);
      if (operator === "last_quarter") return isLastQuarter(compare);
      if (operator === "last_year") return isLastYear(compare);

      if (operator === "year_to_date") return isYtd(compare);

      if (operator === "all_dates_in_the_period") {
        return isInPeriod(compare, value as Period);
      }

      return false;
    };

    return entries.map<Grid.T.FilterFn<GridSpec["data"]>>(([column, filter]) => {
      return (row) => {
        const value = row.data[column as keyof GridSpec["data"]];

        // We are only working with number filters, so lets filter out none number
        if (typeof value !== "string") return false;

        const compareValue = value;

        const leftResult = evaluateDateFilter(filter.left.operator, compareValue, filter.left.value);
        if (!filter.right) return leftResult;

        if (filter.operator === "OR")
          return leftResult || evaluateDateFilter(filter.right.operator, compareValue, filter.right.value);

        return leftResult && evaluateDateFilter(filter.right.operator, compareValue, filter.right.value);
      };
    });
  }, [filter]);

  const ds = useClientDataSource<GridSpec>({
    data: data,
    filter: filterFn,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        apiExtension={useMemo(() => ({ filterModel }), [filterModel])}
        rowSource={ds}
        columns={columns}
        columnBase={base}
      />
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function DollarCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

export function DateCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return <div className="flex h-full w-full items-center tabular-nums">{String(field)}</div>;
}
export function SwitchToggle(props: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label className="text-ln-text-dark text-sm leading-none" htmlFor={id}>
        {props.label}
      </label>
      <Switch.Root
        className="bg-ln-gray-10 data-[state=checked]:bg-ln-primary-50 h-5.5 w-9.5 border-ln-border-strong relative cursor-pointer rounded-full border outline-none"
        id={id}
        checked={props.checked}
        onCheckedChange={(c) => props.onChange(c)}
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" } as CSSProperties}
      >
        <Switch.Thumb className="size-4.5 block translate-x-0.5 rounded-full bg-white/95 shadow transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
