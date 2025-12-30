//#start
import "./demo.css";
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";

type PerformanceData = (typeof companiesWithPricePerf)[number];
export interface GridSpec {
  readonly data: PerformanceData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "Company", widthFlex: 2 },
  { id: "Country", widthFlex: 2 },
  { id: "Founded", type: "number" },
  { id: "Employee Cnt", name: "Employees", type: "number", cellRenderer: NumberCell },
  { id: "Price", type: "number", cellRenderer: PriceCell },
];

const rowDetailExpansions = new Set(["leaf-0"]);
const rowDetailRenderer: Grid.Props<GridSpec>["rowDetailRenderer"] = (p) => {
  if (!p.api.rowIsLeaf(p.row)) return;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "20px 20px 20px 0px",
      }}
    >
      <PriceChart row={p.row} />
    </div>
  );
};
const base: Grid.ColumnBase<GridSpec> = { width: 100, widthFlex: 1 };

//#end
export default function RowDetail() {
  const ds = useClientDataSource({
    data: companiesWithPricePerf,
  });

  return (
    <div style={{ height: 500 }} className="detail-styles">
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        rowDetailRenderer={rowDetailRenderer}
        rowDetailExpansions={rowDetailExpansions}
        rowDetailHeight={300}
      />
    </div>
  );
}
//#start

function PriceChart({ row }: { row: Grid.T.RowLeaf<GridSpec["data"]> }) {
  const data = useMemo(() => {
    if (!row.data) return [];
    const weeks: Record<string, { week: number; [key: string]: number }> = Object.fromEntries(
      Array.from({ length: 52 }, (_, i) => [i + 1, { week: i + 1 }]),
    );

    const data = row.data["1 Year Perf"];

    data.forEach((dp, i) => {
      weeks[i + 1][row.id] = dp;
    });
    return Object.values(weeks).sort((l, r) => l.week - r.week);
  }, [row.data, row.id]);

  return (
    <ResponsiveContainer height="100%" width="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient key={row.id} id={row.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color.stop5} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color.stop95} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          ticks={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
          fontSize="14px"
          tickLine={false}
        />
        <YAxis fontFamily="Inter" fontSize="14px" tickLine={false} axisLine={false} />
        <CartesianGrid vertical={false} stroke="var(--lng1771-gray-10)" />

        <Area
          key={row.id}
          type="monotone"
          dataKey={row.id}
          stroke={color.solid}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#${row.id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
const color = {
  name: "Ruby Red",
  solid: "#CC5500",
  stop5: "#CC5500",
  stop95: "transparent",
};

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function PriceCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
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
//#end
