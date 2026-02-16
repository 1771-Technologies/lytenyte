//#start
import { companiesWithPricePerf } from "@1771technologies/grid-sample-data/companies-with-price-performance";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import styled from "@emotion/styled";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

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

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(white, hsla(190, 32%, 6%, 1));
  color: light-dark(hsla(175, 6%, 38%, 1), hsla(175, 10%, 86%, 1));
  font-size: 14px;
  border-bottom: 1px solid light-dark(hsla(175, 20%, 95%, 1), hsla(177, 19%, 17%, 1));
`;

const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(hsla(175, 12%, 92%, 1), hsla(177, 19%, 17%, 1));
  color: light-dark(hsla(177, 19%, 17%, 1), hsla(175, 12%, 92%, 1));
  text-transform: capitalize;
  font-size: 14px;
`;

const Row = styled(Grid.Row)`
  &[data-ln-alternate="true"] [data-ln-cell="true"] {
    background-color: light-dark(hsl(0, 27%, 98%), hsl(184, 33%, 8%));
  }
`;

//#end

//!next 11
const RowsContainer = styled(Grid.RowsContainer)`
  & [data-ln-row-detail="true"] {
    padding: 24px;
  }

  & [data-ln-row-detail="true"] > div {
    border: 1px solid var(--lng1771-gray-30);
    border-radius: 8px;
    background-color: light-dark(white, transparent);
  }
`;

export default function ThemingDemo() {
  const ds = useClientDataSource({
    data: companiesWithPricePerf,
  });

  const cache = useMemo(() => {
    return createCache({ key: "x" });
  }, []);

  return (
    <CacheProvider value={cache}>
      <div style={{ height: 500 }}>
        <Grid
          columns={columns}
          columnBase={base}
          rowSource={ds}
          rowDetailRenderer={rowDetailRenderer}
          rowDetailExpansions={rowDetailExpansions}
          rowDetailHeight={300}
        >
          <Grid.Viewport>
            <Grid.Header>
              {(cells) => {
                return (
                  <Grid.HeaderRow>
                    {cells.map((cell) => {
                      if (cell.kind === "group") return null;

                      return <HeaderCell key={cell.id} cell={cell} />;
                    })}
                  </Grid.HeaderRow>
                );
              }}
            </Grid.Header>
            {/*!next */}
            <RowsContainer>
              <Grid.RowsCenter>
                {(row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Row row={row}>
                      {row.cells.map((cell) => {
                        return <Cell cell={cell} key={cell.id} />;
                      })}
                    </Row>
                  );
                }}
              </Grid.RowsCenter>
            </RowsContainer>
          </Grid.Viewport>
        </Grid>
      </div>
    </CacheProvider>
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
        <CartesianGrid vertical={false} stroke="var(--ln-border)" />

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
