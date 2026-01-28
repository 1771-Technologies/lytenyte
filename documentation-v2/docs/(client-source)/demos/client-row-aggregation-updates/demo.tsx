//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import {
  computeField,
  Grid,
  Menu,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import { useMemo, useState } from "react";
import { loanData, type LoanDataItem } from "@1771technologies/grid-sample-data/loan-data";
import {
  AgeCell,
  CountryCell,
  CustomerRating,
  DateCell,
  DurationCell,
  NameCell,
  NumberCell,
  OverdueCell,
} from "./components.js";
import { CheckIcon } from "@radix-ui/react-icons";

export interface GridSpec {
  readonly data: LoanDataItem;
  readonly column: { agg: string; allowedAggs: string[] };
}

const numberAllowed = ["first", "last", "count", "min", "max", "avg", "sum"];
const stringAllowed = ["first", "last", "count", "same"];

const initialColumns: Grid.Column<GridSpec>[] = [
  {
    name: "Name",
    id: "name",
    cellRenderer: NameCell,
    width: 110,
    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Country",
    id: "country",
    width: 150,
    cellRenderer: CountryCell,
    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Loan Amount",
    id: "loanAmount",
    width: 150,
    type: "number",
    cellRenderer: NumberCell,
    agg: "avg",
    allowedAggs: numberAllowed,
  },
  {
    name: "Balance",
    id: "balance",
    type: "number",
    cellRenderer: NumberCell,

    agg: "avg",
    allowedAggs: numberAllowed,
  },
  {
    name: "Customer Rating",
    id: "customerRating",
    type: "number",
    width: 175,
    cellRenderer: CustomerRating,

    agg: "avg",
    allowedAggs: numberAllowed,
  },
  {
    name: "Marital",
    id: "marital",

    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Education",
    id: "education",
    hide: true,

    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Job",
    id: "job",
    width: 120,
    hide: true,

    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Overdue",
    id: "overdue",
    cellRenderer: OverdueCell,

    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Duration",
    id: "duration",
    type: "number",
    cellRenderer: DurationCell,

    agg: "avg",
    allowedAggs: numberAllowed,
  },
  {
    name: "Date",
    id: "date",
    width: 110,
    cellRenderer: DateCell,

    agg: "same",
    allowedAggs: stringAllowed,
  },
  {
    name: "Age",
    id: "age",
    width: 80,
    type: "number",
    cellRenderer: AgeCell,

    agg: "avg",
    allowedAggs: numberAllowed,
  },
  {
    name: "Contact",
    id: "contact",

    agg: "same",
    allowedAggs: stringAllowed,
  },
];

const base: Grid.ColumnBase<GridSpec> = { width: 150, headerRenderer: HeaderCell };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

//#end

const avg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return Math.round(sum(values) / values.length);
};
const sumAgg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};
const count: Grid.T.Aggregator<GridSpec["data"]> = (_, data) => {
  return data.length;
};
const max: Grid.T.Aggregator<GridSpec["data"]> = (f, data) => {
  return Math.max(...data.map((x) => computeField<number>(f, x)));
};
const min: Grid.T.Aggregator<GridSpec["data"]> = (f, data) => {
  return Math.min(...data.map((x) => computeField<number>(f, x)));
};

const same: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = uniq(data.map((x) => computeField(field, x)));
  return values.length === 1 ? values[0] : null;
};
const first: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  return computeField(field, data[0]);
};
const last: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  return computeField(field, data.at(-1)!);
};

export default function GridTheming() {
  const [columns, setColumns] = useState(initialColumns);

  const aggModel = useMemo(() => {
    return columns.map((x) => ({ dim: x, fn: x.agg }));
  }, [columns]);

  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggModel,
    aggregateFns: {
      avg,
      count,
      first,
      last,
      sum: sumAgg,
      same,
      min,
      max,
    },
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        columnBase={base}
        rowGroupColumn={group}
        onColumnsChange={setColumns}
      />
    </div>
  );
}

//#start

export function HeaderCell({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      className={tw(
        "flex items-center justify-between gap-2",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      {column.agg && (
        <Menu>
          <Menu.Trigger className="text-ln-primary-50 hover:bg-ln-bg-strong cursor-pointer rounded px-1 py-1 text-[10px] transition-colors">
            ({column.agg})
          </Menu.Trigger>
          <Menu.Popover>
            <Menu.Arrow />
            <Menu.Container>
              <Menu.RadioGroup
                value={column.agg}
                onChange={(x) => {
                  api.columnUpdate({ [column.id]: { agg: x } });
                }}
              >
                {column.allowedAggs.map((x) => {
                  return (
                    <Menu.RadioItem key={x} value={x} className="flex items-center justify-between gap-1">
                      {x}
                      {column.agg === x && <CheckIcon className="text-ln-primary-50" />}
                    </Menu.RadioItem>
                  );
                })}
              </Menu.RadioGroup>
            </Menu.Container>
          </Menu.Popover>
        </Menu>
      )}
    </div>
  );
}
function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
