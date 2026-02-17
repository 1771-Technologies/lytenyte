import "@1771technologies/lytenyte-pro/pill-manager.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
  StickGroupHeader,
  style,
} from "./components.jsx";
import { sum } from "es-toolkit";
import { RowGroupCell } from "@1771technologies/lytenyte-pro/components";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly column: {
    measurable?: boolean;
  };
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 110 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 80 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },

  { id: "profit", name: "Profit", width: 100, type: "number", cellRenderer: ProfitCell, measurable: true },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60, measurable: true },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell, measurable: true },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell, measurable: true },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell, measurable: true },

  { id: "state", name: "State", width: 150 },
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 130, widthFlex: 1 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};
const aggAvg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values) / values.length;
};

export default function PivotDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: [{ id: "ageGroup" }],
      rows: [{ id: "country" }],
      measures: [
        {
          dim: {
            ...columns.find((x) => x.id === "profit")!,
            id: "Profit (sum)",
            field: "profit",
            name: "Profit (sum)",
            width: 100,
          },
          fn: "sum",
        },
        {
          dim: {
            ...columns.find((x) => x.id === "profit")!,
            id: "Profit (avg)",
            field: "profit",
            name: "Profit (avg)",
            width: 100,
          },
          fn: "avg",
        },
      ],
    },
    aggregateFns: { sum: aggSum, avg: aggAvg },
  });

  const pivotProps = ds.usePivotProps();
  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          columns={columns}
          rowSource={ds}
          columnBase={base}
          rowGroupColumn={group}
          {...pivotProps}
          styles={style}
          columnGroupRenderer={StickGroupHeader}
        />
      </div>
    </>
  );
}
