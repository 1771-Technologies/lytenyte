import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import {
  computeField,
  Grid,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { sum } from "es-toolkit";

export interface GridSpec {
  readonly data: SaleDataItem;
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 110 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 80 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "state", name: "State", width: 150 },
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};

export default function PivotDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      colLabelFilter: [
        (s) => {
          return s !== "Under 25";
        },
      ],
      rowLabelFilter: [
        (s) => {
          return s === "Germany" || s === "United States";
        },
      ],
      columns: [{ id: "ageGroup" }],
      rows: [{ id: "country" }, { id: "productCategory" }],
      measures: [
        {
          dim: {
            id: "profit",
            name: "Profit",
            type: "number",
            cellRenderer: ProfitCell,
            width: 140,
          },
          fn: "sum",
        },
      ],
    },
    rowGroupDefaultExpansion: true,
    aggregateFns: { sum: aggSum },
  });

  const pivotProps = ds.usePivotProps();
  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid columns={columns} rowSource={ds} columnBase={base} rowGroupColumn={group} {...pivotProps} />
      </div>
    </>
  );
}
