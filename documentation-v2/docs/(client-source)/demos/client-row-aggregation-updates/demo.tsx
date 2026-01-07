//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
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

export type BankData = (typeof bankDataSmall)[number];
interface GridSpec {
  readonly data: BankData;
  readonly column: { agg: string; allowedAggs: string[] };
}

const initialColumns: Grid.Column<GridSpec>[] = [
  {
    name: "Job",
    id: "job",
    width: 120,
    hide: true,
    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Age",
    id: "age",
    type: "number",
    width: 80,
    cellRenderer: NumberCell,
    agg: "avg",
    allowedAggs: ["avg", "sum", "count"],
  },
  {
    name: "Balance",
    id: "balance",
    type: "number",
    cellRenderer: BalanceCell,
    agg: "avg",
    allowedAggs: ["avg", "sum", "count"],
  },
  {
    name: "Education",
    id: "education",
    hide: true,
    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Marital",
    id: "marital",
    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Default",
    id: "default",

    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Housing",
    id: "housing",

    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Loan",
    id: "loan",

    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Contact",
    id: "contact",

    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Day",
    id: "day",
    type: "number",
    cellRenderer: NumberCell,
    agg: "avg",
    allowedAggs: ["avg", "sum", "count"],
  },
  {
    name: "Month",
    id: "month",
    agg: "onlyOneUnique",
    allowedAggs: ["onlyOneUnique", "first", "last"],
  },
  {
    name: "Duration",
    id: "duration",
    type: "number",
    cellRenderer: DurationCell,

    agg: "avg",
    allowedAggs: ["avg", "sum", "count"],
  },
];

const base: Grid.ColumnBase<GridSpec> = { width: 150, headerRenderer: HeaderCell };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

//#end

const avg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values) / values.length;
};
const sumAgg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};
const count: Grid.T.Aggregator<GridSpec["data"]> = (_, data) => {
  return data.length;
};

const onlyOneUnique: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
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
    data: bankDataSmall,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggModel,
    aggregateFns: {
      avg,
      count,
      first,
      last,
      sum: sumAgg,
      onlyOneUnique,
    },
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
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

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const prefix = column.agg === "count" && row.kind === "branch" ? "" : "$";

  if (typeof field === "number") {
    if (field < 0) return `-${prefix}${formatter.format(Math.abs(field))}`;

    return prefix + formatter.format(field);
  }

  return `${field ?? "-"}`;
}
export function DurationCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);
  const suffix = column.agg === "count" && row.kind === "branch" ? "" : "days";

  return typeof field === "number" ? `${formatter.format(field)} ${suffix}` : `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

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
        <Menu.Root>
          <Menu.Trigger className="text-ln-primary-50 hover:bg-ln-bg-strong cursor-pointer rounded px-1 py-1 text-[10px] transition-colors">
            ({column.agg === "onlyOneUnique" ? "only1" : column.agg})
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
                    <Menu.RadioItem key={x} value={x}>
                      {x === "onlyOneUnique" ? "only1" : x}
                    </Menu.RadioItem>
                  );
                })}
              </Menu.RadioGroup>
            </Menu.Container>
          </Menu.Popover>
        </Menu.Root>
      )}
    </div>
  );
}
function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
