//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import {
  AnalystRatingCell,
  PercentCell,
  CurrencyCell,
  SymbolCell,
  CompactNumberCell,
  CurrencyCellGBP,
} from "./components.jsx";

type StockData = (typeof stockData)[number];

export interface GridSpec {
  readonly data: StockData;
}
//#end

const columns: Grid.Column<GridSpec>[] = [
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220 },
  { field: 2, id: "analyst-rating", name: "Analyst Rating", cellRenderer: AnalystRatingCell, width: 130 },
  {
    field: 3,
    id: "price",
    name: "USD Price",
    type: "number",
    cellRenderer: CurrencyCell,
    width: 110,
  },
  //!next 11
  {
    field: ({ row }) => {
      if (row.kind === "branch" || !row.data) return 0;
      return ((row.data as StockData)[3] as number) * 1.36;
    },
    id: "price gbp",
    name: "GBP Price",
    type: "number",
    cellRenderer: CurrencyCellGBP,
    width: 110,
  },
  { field: 5, id: "change", type: "number", cellRenderer: PercentCell, width: 130 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 130 },
  { field: 6, id: "volume", type: "number", cellRenderer: CompactNumberCell, width: 130 },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1 };

export default function ColumnFieldNumberIndex() {
  const ds = useClientDataSource({ data: stockData });

  return (
    <div className="ln-grid ln-cell:text-xs ln-cell:font-light ln-header:text-xs" style={{ height: 500 }}>
      <Grid columns={columns} columnBase={base} rowSource={ds} />
    </div>
  );
}
