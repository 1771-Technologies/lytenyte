//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import { PercentCell, CurrencyCell, SymbolCell, CompactNumberCell } from "./components.jsx";

type StockData = (typeof stockData)[number];

export interface GridSpec {
  readonly data: StockData;
}

const columns: Grid.Column<GridSpec>[] = [
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220 },
  { field: 3, id: "price", type: "number", name: "Price", cellRenderer: CurrencyCell, width: 110 },
  { field: 5, id: "change", type: "number", name: "Change", cellRenderer: PercentCell, width: 130 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 130 },
  { field: 6, id: "volume", name: "Volume", type: "number", cellRenderer: CompactNumberCell, width: 130 },
];
//#end

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1 };

const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: (p) => {
    return <div className="flex h-full w-full items-center justify-center text-xs">{p.rowIndex + 1}</div>;
  },
};

export default function CellSelection() {
  const ds = useClientDataSource({ data: stockData });

  return (
    <div
      className="ln-grid ln-cell:text-xs ln-cell:font-light ln-row:data-[ln-cell-selected=true]:ln-cell-marker:bg-ln-primary-10 ln-header:text-xs ln-cell-marker:border-e ln-cell-marker:border-ln-border ln-cell-marker:bg-ln-gray-05 ln-header-marker:bg-ln-gray-05 ln-header:data-[ln-cell-selected=true]:bg-ln-primary-05"
      style={{ height: 500 }}
    >
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        cellSelectMode="range"
        cellSelectionExcludeMarker
        columnMarker={marker}
      />
    </div>
  );
}
