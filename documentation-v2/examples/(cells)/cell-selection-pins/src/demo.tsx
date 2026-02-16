//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import { PercentCell, CurrencyCell, SymbolCell, CompactNumberCell } from "./components.jsx";

type StockData = (typeof stockData)[number];

export interface GridSpec {
  readonly data: StockData;
}

const columns: Grid.Column<GridSpec>[] = [
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220, pin: "start" },
  { field: 3, id: "price", type: "number", name: "Price", cellRenderer: CurrencyCell, width: 200 },
  { field: 5, id: "change", type: "number", name: "Change", cellRenderer: PercentCell, width: 200 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 200 },
  {
    field: 6,
    id: "volume",
    name: "Volume",
    type: "number",
    cellRenderer: CompactNumberCell,
    width: 130,
    pin: "end",
  },
];
//#end

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1 };

export default function CellDemo() {
  const ds = useClientDataSource({
    data: stockData.slice(2, -2),
    topData: stockData.slice(0, 2),
    botData: stockData.slice(-2),
  });

  return (
    <div className="ln-grid ln-cell:text-xs ln-cell:font-light ln-header:text-xs" style={{ height: 500 }}>
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        cellSelectionMode="range"
        slotShadows={ViewportShadows}
      />
    </div>
  );
}
