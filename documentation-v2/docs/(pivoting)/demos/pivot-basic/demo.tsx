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
  AgeGroupPivotHeader,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
  StickGroupHeader,
  style,
  SwitchToggle,
} from "./components.js";
import { sum } from "es-toolkit";
import { useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 160 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 120 },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
  { id: "product", name: "Product", width: 160 },
  { id: "state", name: "State", width: 150 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120, widthFlex: 1 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};

export default function PivotDemo() {
  const [pivotMode, setPivotMode] = useState(true);
  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: pivotMode,
    pivotModel: {
      columns: [{ id: "ageGroup" }],
      rows: [{ id: "country" }],
      measures: [
        {
          dim: {
            ...columns.find((x) => x.id === "profit")!,
            headerRenderer: AgeGroupPivotHeader,
            width: 120,
          },
          fn: "sum",
        },
      ],
    },

    aggregateFns: {
      sum: aggSum,
    },
  });

  const pivotProps = ds.usePivotProps();

  return (
    <>
      <div className="border-ln-border border-b px-2 py-2">
        <SwitchToggle label="Pivot Mode" checked={pivotMode} onChange={setPivotMode} />
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          columns={columns}
          rowSource={ds}
          columnBase={base}
          rowGroupColumn={group}
          {...pivotProps}
          columnGroupRenderer={StickGroupHeader}
          styles={style}
        />
      </div>
    </>
  );
}
