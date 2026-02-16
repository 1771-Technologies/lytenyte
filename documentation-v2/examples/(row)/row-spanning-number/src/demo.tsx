//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { historicalCompareDataset as stockData } from "./data.js";
import { AnalystRatingCell, PercentCell, CurrencyCell, SymbolCell, CompactNumberCell } from "./components.js";

type StockData = (typeof stockData)[number];

export interface GridSpec {
  readonly data: StockData;
}
//#end

const columns: Grid.Column<GridSpec>[] = [
  //!next
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220, rowSpan: 2 },
  { field: 2, id: "analyst-rating", name: "Analyst Rating", cellRenderer: AnalystRatingCell, width: 130 },
  { field: 3, id: "price", type: "number", name: "Price", cellRenderer: CurrencyCell, width: 110 },
  { field: 5, id: "change", type: "number", name: "Change", cellRenderer: PercentCell, width: 130 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 130 },
  { field: 6, id: "volume", name: "Volume", type: "number", cellRenderer: CompactNumberCell, width: 130 },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1 };

export default function RowDemo() {
  const ds = useClientDataSource({ data: stockData });

  return (
    <div className="ln-grid ln-cell:text-xs ln-cell:font-light ln-header:text-xs" style={{ height: 500 }}>
      <Grid columns={columns} columnBase={base} rowSource={ds} />
    </div>
  );
}
