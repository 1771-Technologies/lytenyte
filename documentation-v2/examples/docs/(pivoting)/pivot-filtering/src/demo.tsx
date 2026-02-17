import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import {
  computeField,
  Grid,
  useClientDataSource,
  usePiece,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro";
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
import { useMemo, useState } from "react";
import { Header } from "./filter.jsx";
import { RowGroupCell } from "@1771technologies/lytenyte-pro/components";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly api: {
    readonly filterModel: PieceWritable<Record<string, GridFilter>>;
  };
}

export type FilterNumberOperator =
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "equals"
  | "not_equals";

export interface FilterNumber {
  readonly operator: FilterNumberOperator;
  readonly value: number;
}

export interface GridFilter {
  readonly left: FilterNumber;
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
  pin: "start",
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};

export default function PivotDemo() {
  const [filter, setFilter] = useState<Record<string, GridFilter>>({});
  const filterModel = usePiece(filter, setFilter);

  const filterFn = useMemo<(Grid.T.HavingFilterFn | null)[]>(() => {
    const entries = Object.entries(filter);

    const evaluateNumberFilter = (operator: FilterNumberOperator, compare: number, value: number) => {
      if (operator === "equals") return value === compare;
      if (operator === "greater_than") return compare > value;
      if (operator === "greater_than_or_equals") return compare >= value;
      if (operator === "less_than") return compare < value;
      if (operator === "less_than_or_equals") return compare <= value;
      if (operator === "not_equals") return value !== compare;

      return false;
    };

    return [
      null,
      (row) => {
        for (const [column, filter] of entries) {
          const value = row.data[column as keyof GridSpec["data"]];

          // We are only working with number filters, so lets filter out none number
          if (typeof value !== "number") return false;

          const compareValue = value;

          if (!evaluateNumberFilter(filter.left.operator, compareValue, filter.left.value)) return false;
        }

        return true;
      },
    ];
  }, [filter]);

  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: [{ id: "ageGroup" }],
      rows: [{ id: "country" }, { id: "productCategory" }],
      filter: filterFn,
      measures: [
        {
          dim: {
            id: "profit",
            name: "Profit",
            type: "number",
            cellRenderer: ProfitCell,
            width: 180,
            headerRenderer: Header,
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
        <Grid
          apiExtension={useMemo(() => ({ filterModel }), [filterModel])}
          columns={columns}
          rowSource={ds}
          columnBase={base}
          rowGroupColumn={group}
          {...pivotProps}
        />
      </div>
    </>
  );
}
